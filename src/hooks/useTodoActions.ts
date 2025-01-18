/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo, useState } from "react";
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
    isLoading,
  } = useSWR("/api/todos", getTodos, {
    refreshInterval: 5000, // Adjust refresh interval for better performance
    revalidateOnFocus: false, // Disable revalidation on focus to reduce unnecessary fetches
    revalidateOnReconnect: true,
  });

  const [isMutating, setIsMutating] = useState(false);

  // Show error toast if there's an error fetching todos
  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error.message}`);
    }
  }, [error]);

  const showToastError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  /**
   * Add a new todo item
   */
  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) {
        return showToastError("Todo cannot be empty.");
      }
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
          }
        );
        toast.success("Todo added!");
      } catch {
        showToastError("Failed to add todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  /**
   * Toggle the completion status of a todo item
   */
  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      if (isMutating) return; // Prevent overlapping mutations
      setIsMutating(true);

      try {
        await mutate(
          async (currentTodos) => {
            const todo = currentTodos?.find((item) => item.id === todoId);
            if (!todo) return currentTodos;

            const updatedTodo = { ...todo, completed: !todo.completed };

            // Send update request to the server
            await updateTodo(updatedTodo);

            // Return updated todos list
            return currentTodos?.map((item) =>
              item.id === todoId ? updatedTodo : item
            );
          },
          {
            optimisticData: (currentTodos) =>
              currentTodos?.map((item) =>
                item.id === todoId ? { ...item, completed: !item.completed } : item
              ),
            rollbackOnError: true,
            revalidate: false,
          }
        );

        toast.success("Todo toggled successfully!");
      } catch {
        showToastError("Failed to toggle todo completion.");
      } finally {
        setIsMutating(false); // End mutation
      }
    },
    [isMutating, mutate, showToastError]
  );

  /**
   * Update the text of a todo item
   */
  const handleUpdateTodo = useCallback(
    async (todoId: string, newText: string) => {
      const trimmedText = newText.trim();
      if (!trimmedText) {
        return showToastError("Todo text cannot be empty.");
      }
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
              item.id === todoId ? todoUpdate : item
            );
          },
          {
            optimisticData: todos.map((item) =>
              item.id === todoId ? todoUpdate : item
            ),
            rollbackOnError: true,
            revalidate: false,
          }
        );

        toast.success("Todo updated.");
      } catch {
        showToastError("Failed to update todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  /**
   * Delete a todo item
   */
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
          }
        );

        toast.success("Todo deleted.");
      } catch {
        showToastError("Failed to delete todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  /**
   * Prompt user to edit a todo item's text
   */
  const handleEditClick = useCallback(
    (id: string) => {
      const newText = prompt("New todo text:");
      if (newText?.trim()) handleUpdateTodo(id, newText.trim());
    },
    [handleUpdateTodo]
  );

  /**
   * Confirm and delete a todo item
   */
  const handleDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm("Delete this todo?")) handleDeleteTodo(id);
    },
    [handleDeleteTodo]
  );

  /**
   * Toggle the completion status of a specific todo item
   */
  const handleToggleClick = useCallback(
    (id: string) => handleToggleTodo(id),
    [handleToggleTodo]
  );

  /**
   * Calculate completed todos based on the list of todos
   */
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed).map((todo) => todo.id),
    [todos]
  );

  return useMemo(
    () => ({
      todos,
      error,
      isLoading,
      completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    }),
    [
      todos,
      error,
      isLoading,
      completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    ]
  );
}

export default useTodoActions;
