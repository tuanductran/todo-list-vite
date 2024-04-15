export interface Todo {
  id: number
  text: string
}

export interface TodoFormProps {
  onAddTodo: (text: string) => void
}

export interface TodoListProps {
  todos: Todo[]
  completedTodos: number[] // Assuming the array contains the IDs of completed todos
  handleEditClick: (todoId: number) => void
  handleDeleteClick: (todoId: number) => void
  handleToggleClick: (todoId: number) => void
}
