import { useCallback, useMemo } from "react";
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
  });

  const showToastError = useCallback((message: string) => toast.error(message), []);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return showToastError("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) return showToastError("Duplicate todo text.");

      const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

      mutate(async () => {
        await addTodo(newTodo);
        return [...todos, newTodo];
      }, { optimisticData: [...todos, newTodo], rollbackOnError: true });

      toast.success("Todo added!");
    },
    [todos, mutate, showToastError]
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos.find((t) => t.id === todoId);
      if (!todo) return;

      const updatedTodo = { ...todo, completed: !todo.completed };

      mutate(async () => {
        await updateTodo(updatedTodo);
        return todos.map((t) => (t.id === todoId ? updatedTodo : t));
      }, { optimisticData: todos.map((t) => (t.id === todoId ? updatedTodo : t)), rollbackOnError: true });

      toast.success("Todo status updated!");
    },
    [todos, mutate]
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      mutate(async () => {
        await deleteTodo(todoId);
        return todos.filter((t) => t.id !== todoId);
      }, { optimisticData: todos.filter((t) => t.id !== todoId), rollbackOnError: true });

      toast.success("Todo deleted.");
    },
    [todos, mutate]
  );

  const completedTodos = useMemo(() => todos.filter((t) => t.completed).map((t) => t.id), [todos]);

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
