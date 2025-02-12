import { useContext, useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import { addTodo, deleteTodo, getTodos, updateTodo } from "../api";
import TodoContext from "../context";

export function useTodoActions() {
  const { state, dispatch } = useContext(TodoContext)!;

  const { data, mutate, error } = useSWR("/api/todos", getTodos, {
    refreshInterval: 5000,
  });

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_TODOS", payload: data });
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${getErrorMessage(error)}`);
    }
  }, [error]);

  const addNewTodo = async (text: string): Promise<string | number | undefined> => {
    const trimmedText = text.trim();
    if (!trimmedText) return toast.error("Todo cannot be empty.");
    if (state.todos.some((todo: { text: string }) => todo.text === trimmedText)) {
      return toast.error("Duplicate todo text.");
    }

    const newTodo = { id: uuidv4(), text: trimmedText, completed: false };

    mutate([...state.todos, newTodo], false);
    dispatch({ type: "ADD_TODO", payload: newTodo });

    try {
      await addTodo(newTodo);
      await mutate();
      toast.success("Todo added!");
    }
    catch (err) {
      toast.error(`Failed to add todo: ${getErrorMessage(err)}`);
      mutate(state.todos, false);
    }
  };

  const toggleTodo = async (id: string): Promise<void> => {
    const todo = state.todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    mutate(
      state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      false,
    );
    dispatch({ type: "UPDATE_TODO", payload: updatedTodo });

    try {
      await updateTodo(updatedTodo);
      await mutate();
      toast.success("Todo updated!");
    }
    catch (err) {
      toast.error(`Failed to update todo: ${getErrorMessage(err)}`);
      mutate(state.todos, false);
    }
  };

  const removeTodo = async (id: string): Promise<void> => {
    mutate(state.todos.filter((t) => t.id !== id), false);
    dispatch({ type: "DELETE_TODO", payload: id });

    try {
      await deleteTodo(id);
      await mutate();
      toast.success("Todo deleted.");
    }
    catch (err) {
      toast.error(`Failed to delete todo: ${getErrorMessage(err)}`);
      mutate(state.todos, false);
    }
  };

  return { todos: state.todos, error, addNewTodo, toggleTodo, removeTodo };
}
