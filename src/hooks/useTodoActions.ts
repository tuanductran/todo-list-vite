import { useCallback, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import type { Todo } from "../schema";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";
const SET_TODOS = "SET_TODOS";

function todoReducer(state: Todo[], action: { type: string, payload?: any }) {
  switch (action.type) {
    case SET_TODOS:
      return action.payload;
    case ADD_TODO:
      return [...state, action.payload];
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo,
      );
    case DELETE_TODO:
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
}

function useTodoActions() {
  const { data: todos = [], error, mutate, isLoading } = useSWR<Todo[]>("/api/todos", fetcher);
  const [state, dispatch] = useReducer(todoReducer, todos);

  useEffect(() => {
    if (todos) dispatch({ type: SET_TODOS, payload: todos });
  }, [todos]);

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return toast.error("Todo cannot be empty.");
      if (state.some((todo) => todo.text === trimmedText)) return toast.error("Duplicate todo text.");

      const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

      const promise = async () => {
        dispatch({ type: ADD_TODO, payload: newTodo });
        await mutate((prevTodos) => [...(prevTodos || []), newTodo], false);
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });
        if (!res.ok) throw new Error("Failed to add todo");
        await mutate();
        return newTodo;
      };

      toast.promise(promise, {
        loading: "Adding todo...",
        success: () => "Todo added!",
        error: "Failed to add todo.",
      });
    },
    [state, mutate],
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = state.find((item) => item.id === todoId);
      if (!todo) return;

      const promise = async () => {
        dispatch({ type: TOGGLE_TODO, payload: todoId });
        await mutate((prevTodos) =>
          prevTodos?.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t)), false);
        const res = await fetch(`/api/todos/${todoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...todo, completed: !todo.completed }),
        });
        if (!res.ok) throw new Error("Failed to toggle todo");
        await mutate();
      };

      toast.promise(promise, {
        loading: "Updating status...",
        success: () => "Todo status updated!",
        error: "Failed to update status.",
      });
    },
    [state, mutate],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      const promise = async () => {
        dispatch({ type: DELETE_TODO, payload: todoId });
        await mutate((prevTodos) => prevTodos?.filter((t) => t.id !== todoId), false);
        const res = await fetch(`/api/todos/${todoId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete todo");
        await mutate();
      };

      toast.promise(promise, {
        loading: "Deleting todo...",
        success: () => "Todo deleted.",
        error: "Failed to delete todo.",
      });
    },
    [mutate],
  );

  const handleDeleteClick = useCallback(handleDeleteTodo, [handleDeleteTodo]);
  const handleToggleClick = useCallback(handleToggleTodo, [handleToggleTodo]);

  const completedTodos = useMemo(() => state.filter((todo) => todo.completed).map((todo) => todo.id), [state]);

  return useMemo(
    () => ({
      todos: state,
      error,
      isLoading,
      completedTodos,
      handleAddTodo,
      handleDeleteClick,
      handleToggleClick,
    }),
    [state, error, isLoading, completedTodos, handleAddTodo, handleDeleteClick, handleToggleClick],
  );
}

export default useTodoActions;
