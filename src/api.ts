import type { Todo } from './schema'
import supabase from './supabaseClient'

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
export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
  if (error) {
    throw error
  }
  return data
}

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
}
