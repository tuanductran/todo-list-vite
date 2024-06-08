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

const initializeDB = (): Promise<IDBPDatabase<TodoDB>> => {
  dbInstance ||= openDB<TodoDB>('todosDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
  return dbInstance
}

export const getTodos = async (): Promise<Todo[]> => {
  const db = await initializeDB()
  return db.getAll('todos')
}

export const addTodo = async (todo: Todo): Promise<void> => {
  if (!todo) throw new Error('Todo cannot be null or undefined.')

  const db = await initializeDB()
  await db.put('todos', todo)
}

export const updateTodo = async (updatedTodo: Todo): Promise<void> => {
  if (!updatedTodo) throw new Error('Updated todo cannot be null or undefined.')

  const db = await initializeDB()
  await db.put('todos', updatedTodo)
}

export const deleteTodo = async (todoId: number): Promise<void> => {
  if (todoId == null) throw new Error('Todo ID cannot be null or undefined.')

  const db = await initializeDB()
  await db.delete('todos', todoId)
}

export const getCompletedTodos = async (): Promise<number[]> => {
  const db = await initializeDB()
  const todos = await db.getAll('todos')
  return todos.filter(todo => todo.completed).map(todo => todo.id)
}

export const saveCompletedTodos = async (
  completedTodos: number[]
): Promise<void> => {
  const db = await initializeDB()
  const tx = db.transaction('todos', 'readwrite')
  const store = tx.objectStore('todos')
  const allTodos = await store.getAll()

  await Promise.all(
    allTodos.map(todo =>
      store.put({ ...todo, completed: completedTodos.includes(todo.id) })
    )
  )

  await tx.done
}

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getCompletedTodos,
  saveCompletedTodos
}
