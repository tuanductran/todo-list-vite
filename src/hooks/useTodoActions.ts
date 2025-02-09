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
  const { data: todos = [], error, mutate, isLoading } = useSWR<Todo[]>("/api/todos", getTodos, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const handleAddTodo = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return toast.error("Todo cannot be empty.");
    if (todos.some((todo) => todo.text === trimmedText)) return toast.error("Duplicate todo text.");

    const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

    try {
      await addTodo(newTodo);
      await mutate();
      toast.success("Todo added!");
    } catch {
      toast.error("Failed to add todo.");
    }
  }, [todos, mutate]);

  const handleToggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await updateTodo({ ...todo, completed: !todo.completed });
      await mutate();
      toast.success("Todo status updated!");
    } catch {
      toast.error("Failed to toggle todo.");
    }
  }, [todos, mutate]);

  const handleDeleteTodo = useCallback(async (id: string) => {
    try {
      await deleteTodo(id);
      await mutate();
      toast.success("Todo deleted.");
    } catch {
      toast.error("Failed to delete todo.");
    }
  }, [mutate]);

  return { todos, isLoading, handleAddTodo, handleToggleTodo, handleDeleteTodo };
}

export default useTodoActions;
