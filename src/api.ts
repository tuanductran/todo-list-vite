import type { Todo } from './type'

let todos: Todo[] = []
let currentId = Date.now()

// Load todos from Local Storage if available
const storedTodos = localStorage.getItem('todos')
if (storedTodos) {
  todos = JSON.parse(storedTodos)
}

export async function getTodos(): Promise<Todo[]> {
  return todos
}

export async function addTodo(todo: Todo): Promise<Todo[]> {
  todos = [...todos, { ...todo, id: currentId++ }]
  updateLocalStorage()
  return todos
}

export async function updateTodo(updatedTodo: Todo): Promise<Todo[]> {
  todos = todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
  updateLocalStorage()
  return todos
}

export async function deleteTodo(todoId: number): Promise<Todo[]> {
  todos = todos.filter(todo => todo.id !== todoId)
  updateLocalStorage()
  return todos
}

// Helper function to update Local Storage
function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos))
}
