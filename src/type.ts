import {
  SET_COMPLETED_TODOS,
  ADD_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  TOGGLE_TODO
} from './constants'

/**
 * Interface representing a single Todo item.
 */
export interface Todo {
  id: number
  text: string
  completed?: boolean // Optional, as a new todo may not be completed
}

/**
 * Props for the TodoForm component, which handles adding a new Todo.
 */
export interface TodoFormProps {
  onAddTodo: (text: string) => void // Function to handle adding a new todo
}

/**
 * Props for the TodoList component, which displays a list of todos.
 */
export interface TodoListProps {
  todos: Todo[]
  error: boolean
  completedTodos: number[] // Array of IDs of completed todos
  handleEditClick: (todoId: number) => void // Function to handle editing a todo
  handleDeleteClick: (todoId: number) => void // Function to handle deleting a todo
  handleToggleClick: (todoId: number) => void // Function to toggle a todo's completion status
}

/**
 * State representing the list of todos and their completed status.
 */
export interface State {
  todos: Todo[] // Array of all todos
  completedTodos: number[] // Array of IDs of completed todos
}

/**
 * A helper type for action payloads to reduce repetition.
 */
type TodoActionPayload<T> = { type: T, payload: any }

/**
 * Action type representing all possible actions for manipulating the Todo state.
 */
export type Action =
  | TodoActionPayload<typeof SET_COMPLETED_TODOS> & { payload: number[] } // Set completed todos by IDs
  | TodoActionPayload<typeof ADD_TODO> & { payload: Todo } // Add a new todo
  | TodoActionPayload<typeof UPDATE_TODO> & { payload: Todo } // Update an existing todo
  | TodoActionPayload<typeof DELETE_TODO> & { payload: number } // Delete a todo by ID
  | TodoActionPayload<typeof TOGGLE_TODO> & { payload: number } // Toggle a todo's completed status by ID
