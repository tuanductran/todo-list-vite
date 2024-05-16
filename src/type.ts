/**
 * Interface for a Todo item
 */
export interface Todo {
  id: number
  text: string
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
  completedTodos: number[] // Assuming the array contains the IDs of completed todos
  handleEditClick: (todoId: number) => void
  handleDeleteClick: (todoId: number) => void
  handleToggleClick: (todoId: number) => void
}
