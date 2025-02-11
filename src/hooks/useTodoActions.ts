import { useEffect } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

import { fetchAPI } from "../fetch";
import type { Todo } from "../schema";

const API_URL = "/api/todos";

export function useTodoActions() {
  const { data: todos = [], error } = useSWR<Todo[]>(API_URL, () => fetchAPI<Todo[]>(API_URL), {
    refreshInterval: 5000,
    dedupingInterval: 3000,
    keepPreviousData: true,
    fallbackData: [],
  });

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const addNewTodo = async (text: string): Promise<void> => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      toast.error("Todo cannot be empty.");
      return;
    }
    if (todos.some((todo) => todo.text === trimmedText)) {
      toast.error("Duplicate todo text.");
      return;
    }

    const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

    toast.promise(
      fetchAPI(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      }),
      {
        success: "Todo added!",
        error: (err) => `Failed to add todo: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
    );

    mutate(API_URL, (prevTodos: Todo[] = []) => [...prevTodos, newTodo], false);
  };

  const toggleTodo = async (id: string): Promise<void> => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    toast.promise(
      fetchAPI(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      }),
      {
        success: "Todo updated!",
        error: (err) => `Failed to update todo: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
    );

    mutate(API_URL, (prevTodos: Todo[] = []) => prevTodos.map((t) => (t.id === id ? updatedTodo : t)), false);
  };

  const removeTodo = async (id: string): Promise<void> => {
    toast.promise(
      fetchAPI(`${API_URL}/${id}`, { method: "DELETE" }),
      {
        success: "Todo deleted.",
        error: (err) => `Failed to delete todo: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
    );

    mutate(API_URL, (prevTodos: Todo[] = []) => prevTodos.filter((t) => t.id !== id), false);
  };

  return { todos, error, addNewTodo, toggleTodo, removeTodo };
}
