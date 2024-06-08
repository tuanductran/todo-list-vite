/**
 * Interface for a Todo item
 */
export interface Todo {
  id: number
  text: string
  completed?: boolean
}

/**
 * Props for the TodoForm component
 */
export interface TodoFormProps {
  onAddTodo: (text: string) => void
}

/**
 * Props for the TodoList component
 */
export interface TodoListProps {
  todos: Todo[]
  error: boolean
  completedTodos: number[] // Assuming the array contains the IDs of completed todos
  handleEditClick: (todoId: number) => void
  handleDeleteClick: (todoId: number) => void
  handleToggleClick: (todoId: number) => void
}

/**
 * State type representing todo items and completed todos
 */
export type State = {
  todos: Todo[]
  completedTodos: number[]
}

export type Action =
  | { type: 'SET_COMPLETED_TODOS'; payload: number[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'TOGGLE_TODO'; payload: number }
