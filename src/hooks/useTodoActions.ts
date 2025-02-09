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

      try {
        await addTodo(newTodo);
        await mutate();
        toast.success("Todo added!");
      } catch (error) {
        showToastError("Failed to add todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      try {
        const todo = todos.find((item) => item.id === todoId);
        if (!todo) return;

        const updatedTodo = { ...todo, completed: !todo.completed };
        await updateTodo(updatedTodo);
        await mutate();

        toast.success("Todo status updated!");
      } catch (error) {
        showToastError("Failed to toggle todo.");
      }
    },
    [todos, mutate, showToastError]
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      try {
        await deleteTodo(todoId);
        await mutate();
        toast.success("Todo deleted.");
      } catch (error) {
        showToastError("Failed to delete todo.");
      }
    },
    [mutate, showToastError]
  );

  const handleDeleteClick = useCallback((id: string) => handleDeleteTodo(id), [handleDeleteTodo]);
  const handleToggleClick = useCallback((id: string) => handleToggleTodo(id), [handleToggleTodo]);

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