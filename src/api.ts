import { createClient } from '@supabase/supabase-js'

import type { Todo } from './schema'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

// Add a new todo to Supabase
export async function addTodo(todo: Todo): Promise<void> {
  if (!todo?.id) {
    throw new Error('Invalid todo: Missing ID.')
  }
  const { error } = await supabase.from('todos').insert(todo)
  if (error) {
    throw new Error(`Failed to add todo: ${error.message}`)
  }
}

// Delete a todo by ID from Supabase
export async function deleteTodo(todoId: string): Promise<void> {
  const { error } = await supabase.from('todos').delete().eq('id', todoId)
  if (error) {
    throw new Error(`Failed to delete todo: ${error.message}`)
  }
}

// Get all completed todos' IDs from Supabase
export async function getCompletedTodos(): Promise<string[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('id')
    .eq('completed', true)

  if (error) {
    throw new Error(`Failed to retrieve completed todos: ${error.message}`)
  }

  return data?.map((todo: { id: string }) => todo.id) || []
}

// Fetch all todos from Supabase
export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase.from('todos').select('*')
  if (error) {
    throw new Error(`Failed to fetch todos: ${error.message}`)
  }
  return data || []
}

// Update completion status of multiple todos
export async function saveCompletedTodos(completedTodos: string[]): Promise<void> {
  const updates = completedTodos.map(async (todoId) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: true })
      .eq('id', todoId)

    if (error) {
      throw new Error(`Failed to update todo: ${error.message}`)
    }
  })

  await Promise.all(updates)
}

// Update an existing todo in Supabase
export async function updateTodo(updatedTodo: Todo): Promise<void> {
  if (!updatedTodo?.id) {
    throw new Error('Invalid updated todo: Missing ID.')
  }

  const { error } = await supabase
    .from('todos')
    .update(updatedTodo)
    .eq('id', updatedTodo.id)

  if (error) {
    throw new Error(`Failed to update todo: ${error.message}`)
  }
}
