import { createClient } from '@supabase/supabase-js'

import type { Todo } from './schema'

<<<<<<< Updated upstream
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

=======
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

// Function to add a new todo to Supabase
export async function addTodo(todo: Todo): Promise<void> {
  if (!todo || !todo.id) {
    throw new Error('Invalid todo: The todo or its ID is missing.')
  }
  const { error } = await supabase
    .from('todos')
    .insert(todo)
  if (error) {
    throw error
  }
}

// Function to delete a todo by ID from Supabase
export async function deleteTodo(todoId: string): Promise<void> {
  if (!todoId) {
    throw new Error('Invalid todo ID: Todo ID is required.')
  }
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)
  if (error) {
    throw error
  }
}

// Function to retrieve all completed todos' IDs
export async function getCompletedTodos(): Promise<string[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('id')
    .eq('completed', true)
  if (error) {
    throw error
  }
  return data.map((todo: { id: string }) => todo.id)
}

// Function to fetch all todos from Supabase
>>>>>>> Stashed changes
export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
  if (error) {
    throw error
  }
  return data
}

<<<<<<< Updated upstream
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
=======
// Function to save completed statuses of todos
export async function saveCompletedTodos(completedTodos: string[]): Promise<void> {
  const { data: allTodos, error: fetchError } = await supabase
    .from('todos')
    .select('*')
  if (fetchError) {
    throw fetchError
  }
  const updatePromises = allTodos.map(async (todo) => {
    const isCompleted = completedTodos.includes(todo.id)
    if (todo.completed !== isCompleted) {
      const { error } = await supabase
        .from('todos')
        .update({ completed: isCompleted })
        .eq('id', todo.id)
      if (error) {
        throw error
      }
    }
  })
  await Promise.all(updatePromises)
}

// Function to update an existing todo in Supabase
export async function updateTodo(updatedTodo: Todo): Promise<void> {
  if (!updatedTodo || !updatedTodo.id) {
    throw new Error('Invalid updated todo: The todo or its ID is missing.')
  }
  const { error } = await supabase
    .from('todos')
    .update(updatedTodo)
    .eq('id', updatedTodo.id)
  if (error) {
    throw error
  }
>>>>>>> Stashed changes
}
