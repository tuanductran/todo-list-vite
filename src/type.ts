export interface Todo {
  id: number
  text: string
}

export interface TodoFormPros {
  onAddTodo: (text: string) => void
}

export interface TodoListProps {
  todos: Todo[]
  completedTodos: number[] // Assuming the array contains the IDs of completed todos
  handleToggleCompletion: (todoId: number) => void
  handleUpdateTodo: (todoId: number, newText: string) => void // New prop for updating todos
  handleDeleteTodo: (todoId: number) => void // New prop for deleting todos
}
