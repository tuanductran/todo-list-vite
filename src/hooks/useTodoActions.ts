import { useEffect } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuidv4 } from "uuid";
import type { Todo } from "../schema";

const API_URL = `${import.meta.env.VITE_API_URL}/api/todos`;

export function useTodoActions() {
  const { data: todos = [], error } = useSWR<Todo[]>(API_URL, { refreshInterval: 5000, dedupingInterval: 3000 });

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const { trigger: addNewTodo } = useSWRMutation(
    API_URL,
    async (_, { arg: text }: { arg: string }) => {
      const trimmedText = text.trim();
      if (!trimmedText) throw new Error("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) throw new Error("Duplicate todo text.");

      const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

      mutate(API_URL, (prevTodos: Todo[] = []) => [...prevTodos, newTodo], { optimisticData: [...todos, newTodo] });

      return newTodo;
    },
    {
      onSuccess: () => toast.success("Todo added!"),
      onError: (err) => toast.error(`Failed to add todo: ${err.message}`),
    },
  );

  const { trigger: toggleTodo } = useSWRMutation(
    API_URL,
    async (_, { arg: id }: { arg: string }) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) throw new Error("Todo not found.");

      const updatedTodo = { ...todo, completed: !todo.completed };

      mutate(API_URL, (prevTodos: Todo[] = []) => prevTodos.map((t) => (t.id === id ? updatedTodo : t)), {
        optimisticData: todos.map((t) => (t.id === id ? updatedTodo : t)),
      });

      return updatedTodo;
    },
    {
      onSuccess: () => toast.success("Todo updated!"),
      onError: (err) => toast.error(`Failed to update todo: ${err.message}`),
    },
  );

  const { trigger: removeTodo } = useSWRMutation(
    API_URL,
    async (_, { arg: id }: { arg: string }) => {
      mutate(API_URL, (prevTodos: Todo[] = []) => prevTodos.filter((t) => t.id !== id), {
        optimisticData: todos.filter((t) => t.id !== id),
      });

      return id;
    },
    {
      onSuccess: () => toast.success("Todo deleted!"),
      onError: (err) => toast.error(`Failed to delete todo: ${err.message}`),
    },
  );

  return { todos, error, addNewTodo, toggleTodo, removeTodo };
}
