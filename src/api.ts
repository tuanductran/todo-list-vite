import toast from 'react-hot-toast'
import type { Todo } from './type'

// Initialization of todos and currentId
let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]')
let currentId = Math.max(Date.now(), ...todos.map(todo => todo.id)) + 1

export async function getTodos(): Promise<Todo[]> {
  return todos
}

export async function addTodo(todo: Todo): Promise<Todo[]> {
  const newTodo = { ...todo, id: currentId++ }
  todos.push(newTodo)
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

// Consolidated Local Storage update function
function updateLocalStorage() {
  try {
    localStorage.setItem('todos', JSON.stringify(todos))
  } catch (e) {
    toast.error(`Failed to save todos: ${e}`)
  }
}
