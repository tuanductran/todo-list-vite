import { useState, useEffect } from 'react'
import type { Todo } from './type'

function useTodos(): [Todo[], (todo: Todo) => void, (todo: Todo) => void, (id: number) => void] {
  // State to manage the list of todos
  const [todos, setTodos] = useState<Todo[]>([])

  // Load todos from localStorage (optional)
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []) // Run this effect only once on component initialization

  // Function to add a new todo item
  const addTodo = async (todo: Todo) => {
    try {
      setTodos((prevTodos) => [...prevTodos, { ...todo, id: Date.now() }])
    } catch (error) {
      console.error(error)
    }
  }

  // Function to update an existing todo item
  const updateTodo = async (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    )
  }

  // Function to delete a todo item by ID
  const deleteTodo = async (todoId: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId))
  }

  // Update localStorage when todos change (optional)
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const getTodos = async (): Promise<Todo[]> => {
     return todos
   }

  // Return an array containing the current todos state and functions for adding, updating, deleting todos and get todos
  return [todos, addTodo, updateTodo, deleteTodo, getTodos]
}
