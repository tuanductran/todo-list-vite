import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'

import type { Todo } from './type'

// Define the TodoDB schema interface
interface TodoDB extends DBSchema {
  todos: {
    key: number
    value: Todo
  }
}

// Hold the DB instance for reuse
let dbInstance: Promise<IDBPDatabase<TodoDB>> | null = null

// Initialize the database if it hasn't been opened yet
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

// Fetch all todos from the database
export async function getTodos(): Promise<Todo[]> {
  const db = await initializeDB()
  return db.getAll('todos')
}

// Add a new todo to the database
export async function addTodo(todo: Todo): Promise<void> {
  if (!todo)
    throw new Error('Todo cannot be null or undefined.')

  const db = await initializeDB()
  await db.put('todos', todo)
}

// Update an existing todo in the database
export async function updateTodo(updatedTodo: Todo): Promise<void> {
  if (!updatedTodo)
    throw new Error('Updated todo cannot be null or undefined.')

  const db = await initializeDB()
  await db.put('todos', updatedTodo)
}

// Delete a todo by ID from the database
export async function deleteTodo(todoId: number): Promise<void> {
  if (todoId == null)
    throw new Error('Todo ID cannot be null or undefined.')

  const db = await initializeDB()
  await db.delete('todos', todoId)
}

// Get a list of completed todo IDs
export async function getCompletedTodos(): Promise<number[]> {
  const todos = await getTodos()
  return todos.filter(todo => todo.completed).map(todo => todo.id)
}

// Save completed todo statuses by updating their 'completed' field
export async function saveCompletedTodos(completedTodos: number[]): Promise<void> {
  const db = await initializeDB()
  const tx = db.transaction('todos', 'readwrite')
  const store = tx.objectStore('todos')

  // Get all todos, and update the 'completed' status based on completedTodos
  const allTodos = await store.getAll()
  const updatePromises = allTodos.map((todo) => {
    const isCompleted = completedTodos.includes(todo.id)
    if (todo.completed !== isCompleted) {
      return store.put({ ...todo, completed: isCompleted })
    }
    return Promise.resolve()
  })

  // Await the updates
  await Promise.all(updatePromises)
  await tx.done
}

// Export all functions
export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getCompletedTodos,
  saveCompletedTodos,
}
