import { useEffect, useReducer, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../api";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface State {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Todo[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string };

const initialState: State = {
  todos: [],
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, todos: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    default:
      return state;
  }
}

function useTodoActions() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await getTodos();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        dispatch({ type: "FETCH_ERROR", payload: errorMessage });
        toast.error(`Error fetching todos: ${errorMessage}`);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return toast.error("Todo cannot be empty.");
    if (state.todos.some((todo) => todo.text === trimmedText))
      return toast.error("Duplicate todo text.");

    const newTodo = { id: uuidv4(), text: trimmedText, completed: false };

    try {
      dispatch({ type: "ADD_TODO", payload: newTodo });
      await addTodo(newTodo);
      toast.success("Todo added!");
    } catch (error) {
      dispatch({ type: "DELETE_TODO", payload: newTodo.id }); // Rollback
      toast.error("Failed to add todo.");
    }
  }, [state.todos]);

  const handleToggleTodo = useCallback(async (todoId: string) => {
    const todo = state.todos.find((t) => t.id === todoId);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      dispatch({ type: "UPDATE_TODO", payload: updatedTodo });
      await updateTodo(updatedTodo);
      toast.success("Todo toggled successfully!");
    } catch (error) {
      dispatch({ type: "UPDATE_TODO", payload: todo }); // Rollback
      toast.error("Failed to toggle todo completion.");
    }
  }, [state.todos]);

  const handleDeleteTodo = useCallback(async (todoId: string) => {
    const existingTodos = state.todos;

    try {
      dispatch({ type: "DELETE_TODO", payload: todoId });
      await deleteTodo(todoId);
      toast.success("Todo deleted.");
    } catch (error) {
      dispatch({ type: "FETCH_SUCCESS", payload: existingTodos }); // Rollback
      toast.error("Failed to delete todo.");
    }
  }, [state.todos]);

  const completedTodos = useMemo(
    () => state.todos.filter((todo) => todo.completed).map((todo) => todo.id),
    [state.todos]
  );

  return {
    todos: state.todos,
    isLoading: state.isLoading,
    error: state.error,
    completedTodos,
    handleAddTodo,
    handleToggleClick: handleToggleTodo,
    handleDeleteClick: handleDeleteTodo,
  };
}

export default useTodoActions;
