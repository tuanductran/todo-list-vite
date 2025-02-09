import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function useTodoActions() {
  const { data: todos = [], error, mutate, isLoading } = useSWR<Todo[]>("/api/todos");

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return toast.error("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) return toast.error("Duplicate todo text.");

      const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

      const promise = mutate(
        async (prevTodos) => [...(prevTodos || []), newTodo],
        {
          optimisticData: [...todos, newTodo],
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      toast.promise(promise, {
        loading: "Adding todo...",
        success: () => "Todo added!",
        error: "Failed to add todo.",
      });
    },
    [todos, mutate]
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos.find((item) => item.id === todoId);
      if (!todo) return;

      const updatedTodos = todos.map((t) =>
        t.id === todoId ? { ...t, completed: !t.completed } : t
      );

      const promise = mutate(
        async () => updatedTodos,
        {
          optimisticData: updatedTodos,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      toast.promise(promise, {
        loading: "Updating status...",
        success: () => "Todo status updated!",
        error: "Failed to update status.",
      });
    },
    [todos, mutate]
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      const updatedTodos = todos.filter((t) => t.id !== todoId);

      const promise = mutate(
        async () => updatedTodos,
        {
          optimisticData: updatedTodos,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      toast.promise(promise, {
        loading: "Deleting todo...",
        success: () => "Todo deleted.",
        error: "Failed to delete todo.",
      });
    },
    [todos, mutate]
  );

  const handleDeleteClick = useCallback(handleDeleteTodo, [handleDeleteTodo]);
  const handleToggleClick = useCallback(handleToggleTodo, [handleToggleTodo]);

  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed).map((todo) => todo.id), [todos]);

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
