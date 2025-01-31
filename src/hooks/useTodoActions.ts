/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../api";

interface Todo {
  text: string;
  completed: boolean;
}

function useTodoActions() {
  const { data: todos = [], error, mutate, isLoading } = useSWR<Todo[]>("/api/todos", getTodos, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [error]);

  const showToastError = useCallback((message: string) => toast.error(message), []);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return showToastError("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) return showToastError("Duplicate todo text.");

      const newTodo: Todo = {
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
            populateCache: true,
            revalidate: false,
          }
        );
        toast.success("Todo added!");
      } catch (error) {
        showToastError("Failed to add todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  const handleToggleTodo = useCallback(
    async (todoText: string) => {
      try {
        await mutate(
          async (currentTodos) => {
            const todo = (currentTodos || []).find((item) => item.text === todoText);
            if (!todo) return currentTodos;

            const updatedTodo = { ...todo, completed: !todo.completed };
            await updateTodo(updatedTodo);

            return (currentTodos || []).map((item) =>
              item.text === todoText ? updatedTodo : item
            );
          },
          {
            optimisticData: todos.map((item) =>
              item.text === todoText ? { ...item, completed: !item.completed } : item
            ),
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          }
        );

        toast.success("Todo toggled successfully!");
      } catch (error) {
        showToastError("Failed to toggle todo completion.");
      }
    },
    [todos, mutate, showToastError]
  );

  const handleDeleteTodo = useCallback(
    async (todoText: string) => {
      try {
        await mutate(
          async (currentTodos) => {
            await deleteTodo(todoText);
            return (currentTodos || []).filter((todo) => todo.text !== todoText);
          },
          {
            optimisticData: todos.filter((todo) => todo.text !== todoText),
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          }
        );
        toast.success("Todo deleted.");
      } catch (error) {
        showToastError("Failed to delete todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  const handleDeleteClick = useCallback(
    (text: string) => {
      if (window.confirm("Are you sure you want to delete this todo?")) handleDeleteTodo(text);
    },
    [handleDeleteTodo]
  );

  const handleToggleClick = useCallback(
    (text: string) => handleToggleTodo(text),
    [handleToggleTodo]
  );

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed).map((todo) => todo.text),
    [todos]
  );

  return useMemo(
    () => ({
      todos,
      error,
      isLoading,
      completedTodos,
      handleAddTodo,
      handleDeleteClick,
      handleToggleClick,
    }),
    [todos, error, isLoading, completedTodos, handleAddTodo, handleDeleteClick, handleToggleClick]
  );
}

export default useTodoActions;
