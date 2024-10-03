import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'

import type { Todo } from './type'

interface TodoDB extends DBSchema {
  todos: {
    key: number
    value: Todo
  }
}

let dbInstance: Promise<IDBPDatabase<TodoDB>> | null = null

function initializeDB(): Promise<IDBPDatabase<TodoDB>> {
  dbInstance ||= openDB<TodoDB>('todosDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true })
      }
    },
  })
  return dbInstance
}

export async function getTodos(): Promise<Todo[]> {
  const db = await initializeDB()
  return db.getAll('todos')
}

export async function addTodo(todo: Todo): Promise<void> {
  if (!todo)
    throw new Error('Todo cannot be null or undefined.')

  const db = await initializeDB()
  await db.put('todos', todo)
}

export async function updateTodo(updatedTodo: Todo): Promise<void> {
  if (!updatedTodo)
    throw new Error('Updated todo cannot be null or undefined.')

  const db = await initializeDB()
  await db.put('todos', updatedTodo)
}

export async function deleteTodo(todoId: number): Promise<void> {
  if (todoId == null)
    throw new Error('Todo ID cannot be null or undefined.')

  const db = await initializeDB()
  await db.delete('todos', todoId)
}

export async function getCompletedTodos(): Promise<number[]> {
  const db = await initializeDB()
  const todos = await db.getAll('todos')
  return todos.filter(todo => todo.completed).map(todo => todo.id)
}

export async function saveCompletedTodos(completedTodos: number[]): Promise<void> {
  const db = await initializeDB()
  const tx = db.transaction('todos', 'readwrite')
  const store = tx.objectStore('todos')
  const allTodos = await store.getAll()

  await Promise.all(
    allTodos.map(todo =>
      store.put({ ...todo, completed: completedTodos.includes(todo.id) }),
    ),
  )

  await tx.done
}

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getCompletedTodos,
  saveCompletedTodos,
}
