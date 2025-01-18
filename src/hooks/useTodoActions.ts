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
  const [cooldown, setCooldown] = useState(false);

  /**
   * Utility function to enforce cooldown
   */
  const startCooldown = useCallback(() => {
    setCooldown(true);
    toast.info("Please wait 5 seconds before performing another action.");
    setTimeout(() => setCooldown(false), 5000); // Set cooldown for 5 seconds
  }, []);

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
      if (cooldown) {
        toast.warning("You need to wait before adding another todo.");
        return;
      }
      startCooldown();

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
            optimisticData: (currentTodos) =>
              [...(currentTodos || []), newTodo],
            rollbackOnError: true,
            revalidate: false,
          }
        );
        toast.success("Todo added!");
      } catch {
        showToastError("Failed to add todo.");
      }
    },
    [todos, mutate, showToastError, cooldown, startCooldown]
  );

  /**
   * Toggle the completion status of a todo item
   */
  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      if (cooldown || isMutating) {
        toast.warning("Please wait before toggling another todo.");
        return;
      }
      setIsMutating(true);
      startCooldown();

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
    [isMutating, mutate, showToastError, cooldown, startCooldown]
  );

  /**
   * Delete a todo item
   */
  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      if (cooldown || isMutating) {
        toast.warning("Please wait before deleting another todo.");
        return;
      }
      setIsMutating(true);
      startCooldown();

      try {
        await mutate(
          async (currentTodos) => {
            await deleteTodo(todoId);
            return currentTodos?.filter((todo) => todo.id !== todoId);
          },
          {
            optimisticData: (currentTodos) =>
              currentTodos?.filter((todo) => todo.id !== todoId),
            rollbackOnError: true,
            revalidate: false,
          }
        );

        toast.success("Todo deleted.");
      } catch {
        showToastError("Failed to delete todo.");
      } finally {
        setIsMutating(false); // End mutation
      }
    },
    [todos, mutate, showToastError, cooldown, startCooldown]
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
      handleDeleteClick,
      handleToggleClick,
    }),
    [
      todos,
      error,
      isLoading,
      completedTodos,
      handleAddTodo,
      handleDeleteClick,
      handleToggleClick,
    ]
  );
}

export default useTodoActions;
