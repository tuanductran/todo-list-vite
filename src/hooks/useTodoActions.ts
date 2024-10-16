import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { v4 as uuidv4 } from 'uuid'

import {
  addTodo,
  deleteTodo,
  getCompletedTodos,
  getTodos,
  saveCompletedTodos,
  updateTodo,
} from '../api'
import { todoReducer } from '../reducer'
import type { Todo } from '../schema'

function useTodoActions() {
  const { data: todos, error, mutate } = useSWR<Todo[]>('/api/todos', getTodos, { refreshInterval: 1000 })
  const [state, dispatch] = useReducer(todoReducer, {
    completedTodos: [],
    todos: [],
  })

  // Handle loading errors
  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  // Fetch completed todos on load
  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const completedTodos = await getCompletedTodos()
        dispatch({
          payload: completedTodos,
          type: 'SET_COMPLETED_TODOS',
        })
      }
      catch {
        toast.error('Unable to load completed todos.')
      }
    }
    fetchCompletedTodos()
  }, [])

  // Optimistic UI update for adding a todo
  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim()
      if (!trimmedText) {
        toast.error('Todo text cannot be empty.')
        return
      }

      if (todos?.some(todo => todo.text === trimmedText)) {
        toast.error('Todo text already exists.')
        return
      }

      const newTodo: Todo = { completed: false, id: uuidv4(), text: trimmedText }

      try {
        await mutate(
          async (prevTodos = []) => {
            await addTodo(newTodo)
            return [...prevTodos, newTodo]
          },
          {
            optimisticData: [...(todos || []), newTodo],
            revalidate: false,
            rollbackOnError: true,
          },
        )

        dispatch({ payload: newTodo, type: 'ADD_TODO' })
        toast.success('Todo added successfully.')
      }
      catch {
        toast.error('Failed to add the todo.')
      }
    },
    [todos, mutate],
  )

  // Toggle the completed state of a todo
  const handleToggleTodo = useCallback(
    async (todoId: string) => {
      const todo = todos?.find(todo => todo.id === todoId)
      if (!todo)
        return

      const isCompleted = state.completedTodos.includes(todoId)
      const updatedCompletedTodos = isCompleted
        ? state.completedTodos.filter(id => id !== todoId)
        : [...state.completedTodos, todoId]

      try {
        dispatch({ payload: todoId, type: 'TOGGLE_TODO' })
        dispatch({ payload: updatedCompletedTodos, type: 'SET_COMPLETED_TODOS' })

        await mutate(
          async (prevTodos = []) => {
            await updateTodo({ ...todo, completed: !isCompleted })
            return prevTodos.map(item =>
              item.id === todoId ? { ...item, completed: !isCompleted } : item,
            )
          },
          {
            optimisticData: todos?.map(item =>
              item.id === todoId ? { ...item, completed: !isCompleted } : item,
            ),
            revalidate: false,
            rollbackOnError: true,
          },
        )

        await mutate(
          async (prevTodos = []) => {
            await updateTodo({ ...todo, completed: !isCompleted })
            return prevTodos.map(item =>
              item.id === todoId ? { ...item, completed: !isCompleted } : item,
            )
          },
          {
            optimisticData: todos?.map(item =>
              item.id === todoId ? { ...item, completed: !isCompleted } : item,
            ),
            revalidate: false,
            rollbackOnError: true,
          },
        )

        toast.success(
          isCompleted
            ? 'Todo marked as incomplete.'
            : 'Todo marked as complete.',
        )
        await saveCompletedTodos(updatedCompletedTodos)
      }
      catch {
        toast.error('Failed to change todo completion status.')
        dispatch({ payload: todoId, type: 'TOGGLE_TODO' })
        dispatch({ payload: state.completedTodos, type: 'SET_COMPLETED_TODOS' })
      }
    },
    [todos, state.completedTodos, mutate],
  )

  // Update the text of a todo
  const handleUpdateTodo = useCallback(
    async (todoId: string, newText: string) => {
      const trimmedText = newText.trim()
      if (!trimmedText) {
        toast.error('Todo text cannot be empty.')
        return
      }

      if (todos?.some(todo => todo.text === trimmedText)) {
        toast.error('Todo text already exists.')
        return
      }

      const todoItem = todos?.find(item => item.id === todoId)
      if (todoItem) {
        const updatedTodo = { ...todoItem, text: trimmedText }

        try {
          await mutate(
            async (prevTodos = []) => {
              await updateTodo(updatedTodo)
              return prevTodos.map(item => (item.id === todoId ? updatedTodo : item))
            },
            {
              optimisticData: todos?.map(item => (item.id === todoId ? updatedTodo : item)),
              revalidate: false,
              rollbackOnError: true,
            },
          )

          dispatch({ payload: updatedTodo, type: 'UPDATE_TODO' })
          toast.success('Todo updated successfully.')
        }
        catch {
          toast.error('Failed to update the todo.')
        }
      }
    },
    [todos, mutate],
  )

  // Delete a todo by its ID
  const handleDeleteTodo = useCallback(
    async (todoId: string) => {
      try {
        await mutate(
          async (prevTodos = []) => {
            await deleteTodo(todoId)
            return prevTodos.filter(todo => todo.id !== todoId)
          },
          {
            optimisticData: todos?.filter(todo => todo.id !== todoId),
            revalidate: false,
            rollbackOnError: true,
          },
        )

        dispatch({ payload: todoId, type: 'DELETE_TODO' })
        toast.success('Todo deleted successfully.')
      }
      catch {
        toast.error('Failed to delete the todo.')
      }
    },
    [todos, mutate],
  )

  // Handlers for UI actions (edit, delete, toggle)
  const handleEditClick = useCallback(
    (id: string) => {
      const newText = prompt('Enter the new text:')
      if (newText?.trim()) {
        handleUpdateTodo(id, newText.trim())
      }
    },
    [handleUpdateTodo],
  )

  const handleDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you want to delete this todo?')) {
        handleDeleteTodo(id)
      }
    },
    [handleDeleteTodo],
  )

  const handleToggleClick = useCallback(
    (id: string) => {
      handleToggleTodo(id)
    },
    [handleToggleTodo],
  )

  // Memoized result for performance optimization
  return useMemo(
    () => ({
      completedTodos: state.completedTodos,
      error,
      handleAddTodo,
      handleDeleteClick,
      handleEditClick,
      handleToggleClick,
      todos,
    }),
    [error, todos, state.completedTodos, handleAddTodo, handleDeleteClick, handleEditClick, handleToggleClick],
  )
}

export default useTodoActions
