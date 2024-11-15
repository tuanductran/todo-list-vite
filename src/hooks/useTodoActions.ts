/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import {
  addTodo,
  deleteTodo,
  getCompletedTodos,
  getTodos,
  saveCompletedTodos,
  updateTodo,
} from "../api";
import {
  ADD_TODO,
  DELETE_TODO,
  SET_COMPLETED_TODOS,
  TOGGLE_TODO,
  UPDATE_TODO,
} from "../constants";
import { todoReducer } from "../reducer";
import type { Todo } from "../schema";

function useTodoActions() {
  const {
    data: todos,
    error,
    mutate,
  } = useSWR<Todo[]>("/api/todos", getTodos, { refreshInterval: 1000 });
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    completedTodos: [],
  });

  useEffect(() => {
    if (error) toast.error(`Error fetching todos: ${error.message}`);
  }, [error]);

  useEffect(() => {
    (async () => {
      try {
        const completedTodos = await getCompletedTodos();
        dispatch({ type: SET_COMPLETED_TODOS, payload: completedTodos });
      } catch {
        toast.error("Error loading completed todos.");
      }
    })();
  }, []);

  const showToastError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return showToastError("Todo cannot be empty.");
      if (todos?.some((todo) => todo.text === trimmedText)) {
        return showToastError("Duplicate todo text.");
      }

      const newTodo: Todo = {
        id: uuidv4(),
        text: trimmedText,
        completed: false,
      };

      try {
        await mutate(
          async (currentTodos) => {
            await addTodo(newTodo);
            return [...(currentTodos || []), newTodo];
          },
          {
            optimisticData: [...(todos || []), newTodo],
            rollbackOnError: true,
            revalidate: false,
          },
        );
        dispatch({ type: ADD_TODO, payload: newTodo });
        toast.success("Todo added!");
      } catch {
        showToastError("Failed to add todo.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos?.find((todo) => todo.id === todoId);
      if (!todo) return;

      const updatedCompletedTodos = state.completedTodos.includes(todoId)
        ? state.completedTodos.filter((id) => id !== todoId)
        : [...state.completedTodos, todoId];

      try {
        dispatch({ type: TOGGLE_TODO, payload: todoId });
        dispatch({ type: SET_COMPLETED_TODOS, payload: updatedCompletedTodos });

        await mutate(
          async (currentTodos) => {
            await updateTodo({ ...todo, completed: !todo.completed });
            return currentTodos?.map((item) =>
              item.id === todoId
                ? { ...item, completed: !todo.completed }
                : item,
            );
          },
          {
            optimisticData: todos?.map((item) =>
              item.id === todoId
                ? { ...item, completed: !todo.completed }
                : item,
            ),
            rollbackOnError: true,
            revalidate: false,
          },
        );

        toast.success(
          todo.completed ? "Todo marked incomplete." : "Todo marked complete.",
        );
        await saveCompletedTodos(updatedCompletedTodos);
      } catch {
        showToastError("Failed to toggle todo completion.");
        dispatch({ type: TOGGLE_TODO, payload: todoId });
        dispatch({ type: SET_COMPLETED_TODOS, payload: state.completedTodos });
      }
    },
    [todos, state.completedTodos, mutate, showToastError],
  );

  const handleUpdateTodo = useCallback(
    async (todoId: string, newText: string) => {
      const trimmedText = newText.trim();
      if (!trimmedText) return showToastError("Todo text cannot be empty.");
      if (todos?.some((todo) => todo.text === trimmedText)) {
        return showToastError("Duplicate todo text.");
      }

      const updatedTodo = todos?.find((item) => item.id === todoId);
      if (!updatedTodo) return;

      const todoUpdate = { ...updatedTodo, text: trimmedText };

      try {
        await mutate(
          async (currentTodos) => {
            await updateTodo(todoUpdate);
            return currentTodos?.map((item) =>
              item.id === todoId ? todoUpdate : item,
            );
          },
          {
            optimisticData: todos?.map((item) =>
              item.id === todoId ? todoUpdate : item,
            ),
            rollbackOnError: true,
            revalidate: false,
          },
        );

        dispatch({ type: UPDATE_TODO, payload: todoUpdate });
        toast.success("Todo updated.");
      } catch {
        showToastError("Todo update failed.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      try {
        await mutate(
          async (currentTodos) => {
            await deleteTodo(todoId);
            return currentTodos?.filter((todo) => todo.id !== todoId);
          },
          {
            optimisticData: todos?.filter((todo) => todo.id !== todoId),
            rollbackOnError: true,
            revalidate: false,
          },
        );

        dispatch({ type: DELETE_TODO, payload: todoId });
        toast.success("Todo deleted.");
      } catch {
        showToastError("Todo deletion failed.");
      }
    },
    [todos, mutate, showToastError],
  );

  const handleEditClick = useCallback(
    (id: string) => {
      const newText = prompt("New todo text:");
      if (newText?.trim()) handleUpdateTodo(id, newText.trim());
    },
    [handleUpdateTodo],
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm("Delete this todo?")) handleDeleteTodo(id);
    },
    [handleDeleteTodo],
  );

  const handleToggleClick = useCallback(
    (id: string) => handleToggleTodo(id),
    [handleToggleTodo],
  );

  return useMemo(
    () => ({
      todos,
      error,
      completedTodos: state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    }),
    [
      todos,
      error,
      state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    ],
  );
}

export default useTodoActions;
