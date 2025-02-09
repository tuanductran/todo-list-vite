import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../api";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function useTodoActions() {
  const {
    data: todos = [],
    error,
    mutate,
    isLoading,
  } = useSWR<Todo[]>("/api/todos", getTodos, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const showToastError = useCallback((message: string) => toast.error(message), []);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return showToastError("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) return showToastError("Duplicate todo text.");

      const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

      await mutate(async (currentTodos = []) => {
        try {
          await addTodo(newTodo);
          return [...currentTodos, newTodo];
        } catch {
          showToastError("Failed to add todo.");
          return currentTodos;
        }
      }, { revalidate: false });

      toast.success("Todo added!");
    },
    [todos, mutate, showToastError]
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const updatedTodo = { ...todo, completed: !todo.completed };

      await mutate(async (currentTodos = []) => {
        try {
          await updateTodo(updatedTodo);
          return currentTodos.map((t) => (t.id === todoId ? updatedTodo : t));
        } catch {
          showToastError("Failed to toggle todo.");
          return currentTodos;
        }
      }, { revalidate: false });

      toast.success("Todo status updated!");
    },
    [todos, mutate, showToastError]
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      await mutate(async (currentTodos = []) => {
        try {
          await deleteTodo(todoId);
          return currentTodos.filter((t) => t.id !== todoId);
        } catch {
          showToastError("Failed to delete todo.");
          return currentTodos;
        }
      }, { revalidate: false });

      toast.success("Todo deleted.");
    },
    [mutate, showToastError]
  );

  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed).map((todo) => todo.id), [todos]);

  return useMemo(
    () => ({
      todos,
      error,
      isLoading,
      completedTodos,
      handleAddTodo,
      handleDeleteTodo,
      handleToggleTodo,
    }),
    [todos, error, isLoading, completedTodos, handleAddTodo, handleDeleteTodo, handleToggleTodo]
  );
}

export default useTodoActions;
