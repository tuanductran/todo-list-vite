import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../api";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function useTodoActions() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        toast.error(`Error fetching todos: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const showToastError = useCallback((message: string) => toast.error(message), []);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return showToastError("Todo cannot be empty.");
      if (todos.some((todo) => todo.text === trimmedText)) return showToastError("Duplicate todo text.");

      const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

      try {
        setTodos((prev) => [...prev, newTodo]);
        await addTodo(newTodo);
        toast.success("Todo added!");
      } catch {
        setTodos((prev) => prev.filter((todo) => todo.id !== newTodo.id));
        showToastError("Failed to add todo.");
      }
    },
    [todos, showToastError]
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);

      try {
        const toggledTodo = updatedTodos.find((todo) => todo.id === todoId);
        if (toggledTodo) await updateTodo(toggledTodo);
        toast.success("Todo toggled successfully!");
      } catch {
        setTodos(todos); // Rollback state
        showToastError("Failed to toggle todo completion.");
      }
    },
    [todos, showToastError]
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      const filteredTodos = todos.filter((todo) => todo.id !== todoId);
      setTodos(filteredTodos);

      try {
        await deleteTodo(todoId);
        toast.success("Todo deleted.");
      } catch {
        setTodos(todos); // Rollback state
        showToastError("Failed to delete todo.");
      }
    },
    [todos, showToastError]
  );

  const handleDeleteClick = useCallback(
    (id: string) => handleDeleteTodo(id),
    [handleDeleteTodo]
  );

  const handleToggleClick = useCallback(
    (id: string) => handleToggleTodo(id),
    [handleToggleTodo]
  );

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed).map((todo) => todo.id),
    [todos]
  );

  return {
    todos,
    isLoading,
    error,
    completedTodos,
    handleAddTodo,
    handleDeleteClick,
    handleToggleClick,
  };
}

export default useTodoActions;
