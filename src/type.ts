export interface Todo {
  id: number
  text: string
}

export interface TodoForm {
  onAddTodo: (text: string) => void
}
