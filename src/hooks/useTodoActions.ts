/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import {
  addTodo,
  deleteTodo,
  getTodos,
  saveCompletedTodos,
  updateTodo,
} from "../api";

function useTodoActions() {
  const {
    data: todos = [],
    error,
    mutate,
  } = useSWR("/api/todos", getTodos, { refreshInterval: 1000 });

  useEffect(() => {
    if (error) toast.error(`Error fetching todos: ${error.message}`);
  }, [error]);

  const showToastError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return showToastError("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) {
        return showToastError("Duplicate todo text.");
      }

      const newTodo = {
        id: uuidv4(),
        text: trimmedText,
        completed: false,
      };

      try {
        await mutate(
          async (currentTodos) => {
            await addTodo(newTodo);
            return [...(currentTodos || []), newTodo];
          },
          {
            optimisticData: [...todos, newTodo],
            rollbackOnError: true,
            revalidate: false,
          },
        );
        toast.success("Todo added!");
      } catch {
        showToastError("Failed to add todo.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos.find((todo) => todo.id === todoId);
      if (!todo) return;

      const updatedTodo = { ...todo, completed: !todo.completed };

      try {
        await mutate(
          async (currentTodos) => {
            await updateTodo(updatedTodo);
            return currentTodos?.map((item) =>
              item.id === todoId ? updatedTodo : item,
            );
          },
          {
            optimisticData: todos.map((item) =>
              item.id === todoId ? updatedTodo : item,
            ),
            rollbackOnError: true,
            revalidate: false,
          },
        );

        toast.success(
          updatedTodo.completed
            ? "Todo marked complete."
            : "Todo marked incomplete.",
        );

        // Save completed todos to the server
        const completedTodos = todos
          .filter((item) => item.id !== todoId && item.completed)
          .map((item) => item.id);

        if (updatedTodo.completed) completedTodos.push(todoId);

        await saveCompletedTodos(completedTodos);
      } catch {
        showToastError("Failed to toggle todo completion.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleUpdateTodo = useCallback(
    async (todoId: string, newText: string) => {
      const trimmedText = newText.trim();
      if (!trimmedText) return showToastError("Todo text cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) {
        return showToastError("Duplicate todo text.");
      }

      const updatedTodo = todos.find((item) => item.id === todoId);
      if (!updatedTodo) return;

      const todoUpdate = { ...updatedTodo, text: trimmedText };

      try {
        await mutate(
          async (currentTodos) => {
            await updateTodo(todoUpdate);
            return currentTodos?.map((item) =>
              item.id === todoId ? todoUpdate : item,
            );
          },
          {
            optimisticData: todos.map((item) =>
              item.id === todoId ? todoUpdate : item,
            ),
            rollbackOnError: true,
            revalidate: false,
          },
        );

        toast.success("Todo updated.");
      } catch {
        showToastError("Failed to update todo.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      try {
        await mutate(
          async (currentTodos) => {
            await deleteTodo(todoId);
            return currentTodos?.filter((todo) => todo.id !== todoId);
          },
          {
            optimisticData: todos.filter((todo) => todo.id !== todoId),
            rollbackOnError: true,
            revalidate: false,
          },
        );

        toast.success("Todo deleted.");
      } catch {
        showToastError("Failed to delete todo.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleEditClick = useCallback(
    (id: string) => {
      const newText = prompt("New todo text:");
      if (newText?.trim()) handleUpdateTodo(id, newText.trim());
    },
    [handleUpdateTodo],
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm("Delete this todo?")) handleDeleteTodo(id);
    },
    [handleDeleteTodo],
  );

  const handleToggleClick = useCallback(
    (id: string) => handleToggleTodo(id),
    [handleToggleTodo],
  );

  // Calculate completed todos based on the list of todos
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed).map((todo) => todo.id),
    [todos],
  );

  return useMemo(
    () => ({
      todos,
      error,
      completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    }),
    [
      todos,
      error,
      completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    ],
  );
}

export default useTodoActions;
