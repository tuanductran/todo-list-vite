import toast from 'react-hot-toast'
import type { Todo } from './type'

let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]')
let currentId = Math.max(Date.now(), ...todos.map(todo => todo.id)) + 1

export async function getTodos(): Promise<Todo[]> {
  return todos
}

export async function addTodo(todo: Todo): Promise<Todo[]> {
  if (!todo) {
    toast.error('Todo cannot be null or undefined.')
    return todos
  }

  const newTodo = { ...todo, id: currentId++ }
  todos.push(newTodo)
  updateLocalStorage()
  return todos
}

export async function updateTodo(updatedTodo: Todo): Promise<Todo[]> {
  if (!updatedTodo) {
    toast.error('Updated todo cannot be null or undefined.')
    return todos
  }

  todos = todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
  updateLocalStorage()
  return todos
}

export async function deleteTodo(todoId: number): Promise<Todo[]> {
  if (!todoId) {
    toast.error('Todo ID cannot be null or undefined.')
    return todos
  }

  todos = todos.filter(todo => todo.id !== todoId)
  updateLocalStorage()
  return todos
}

function updateLocalStorage() {
  try {
    localStorage.setItem('todos', JSON.stringify(todos))
  } catch (e) {
    toast.error(`Failed to save todos: ${e}`)
  }
}
