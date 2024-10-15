import { useCallback, useEffect, useMemo, useReducer } from 'react'
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
import { showErrorToast, showSuccessToast } from '../components/Toast'
import { todoReducer } from '../reducer'
import type { Todo } from '../schema'

function useTodoActions() {
<<<<<<< Updated upstream
  const {
    data: todos,
    error,
    mutate,
  } = useSWR<Todo[]>('/api/todos', getTodos, { refreshInterval: 1000 })

=======
  const { data: todos, error, mutate } = useSWR<Todo[]>('/api/todos', getTodos, { refreshInterval: 1000 })
>>>>>>> Stashed changes
  const [state, dispatch] = useReducer(todoReducer, {
    completedTodos: [],
    todos: [],
  })

<<<<<<< Updated upstream
=======
  // Handle loading errors
>>>>>>> Stashed changes
  useEffect(() => {
    if (error) {
      showErrorToast(error.message)
    }
  }, [error])

<<<<<<< Updated upstream
=======
  // Fetch completed todos on load
>>>>>>> Stashed changes
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
        showErrorToast('Unable to load completed todos.')
      }
    }
    fetchCompletedTodos()
  }, [])

<<<<<<< Updated upstream
=======
  // Centralized error handler
  const handleError = useCallback((message: string) => {
    toast.error(message)
  }, [])

  // Optimistic UI update for adding a todo
>>>>>>> Stashed changes
  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim()
      if (!trimmedText) {
        showErrorToast('Todo text cannot be empty.')
        return
      }

      if (todos?.some(todo => todo.text === trimmedText)) {
        showErrorToast('Todo text already exists.')
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
<<<<<<< Updated upstream
            rollbackOnError: true,
            revalidate: false,
          },
        )

        dispatch({ type: 'ADD_TODO', payload: newTodo })
        showSuccessToast('Todo added successfully.')
=======
            revalidate: false,
            rollbackOnError: true,
          },
        )

        dispatch({ payload: newTodo, type: 'ADD_TODO' })
        toast.success('Todo added successfully.')
>>>>>>> Stashed changes
      }
      catch {
        showErrorToast('Failed to add the todo.')
      }
    },
    [todos, mutate, handleError],
  )

<<<<<<< Updated upstream
=======
  // Toggle the completed state of a todo
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        dispatch({ type: 'TOGGLE_TODO', payload: todoId })
        dispatch({
          type: 'SET_COMPLETED_TODOS',
          payload: updatedCompletedTodos,
        })
=======
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
>>>>>>> Stashed changes

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
            rollbackOnError: true,
            revalidate: false,
          },
        )

        showSuccessToast(
          isCompleted
            ? 'Todo marked as incomplete.'
            : 'Todo marked as complete.',
        )
        await saveCompletedTodos(updatedCompletedTodos)
      }
      catch {
<<<<<<< Updated upstream
        showErrorToast('Failed to change todo completion status.')
        dispatch({ type: 'TOGGLE_TODO', payload: todoId })
        dispatch({ type: 'SET_COMPLETED_TODOS', payload: state.completedTodos })
=======
        handleError('Failed to change todo completion status.')
        dispatch({ payload: todoId, type: 'TOGGLE_TODO' })
        dispatch({ payload: state.completedTodos, type: 'SET_COMPLETED_TODOS' })
>>>>>>> Stashed changes
      }
    },
    [todos, state.completedTodos, mutate, handleError],
  )

<<<<<<< Updated upstream
=======
  // Update the text of a todo
>>>>>>> Stashed changes
  const handleUpdateTodo = useCallback(
    async (todoId: string, newText: string) => {
      const trimmedText = newText.trim()
      if (!trimmedText) {
        showErrorToast('Todo text cannot be empty.')
        return
      }

      if (todos?.some(todo => todo.text === trimmedText)) {
        showErrorToast('Todo text already exists.')
        return
      }

      const todoItem = todos?.find(item => item.id === todoId)
      if (todoItem) {
        const updatedTodo = { ...todoItem, text: trimmedText }

        try {
          await mutate(
            async (prevTodos = []) => {
              await updateTodo(updatedTodo)
<<<<<<< Updated upstream
              return prevTodos.map(item =>
                item.id === todoId ? updatedTodo : item,
              )
            },
            {
              optimisticData: todos?.map(item =>
                item.id === todoId ? updatedTodo : item,
              ),
              rollbackOnError: true,
              revalidate: false,
            },
          )

          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo })
          showSuccessToast('Todo updated successfully.')
=======
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
>>>>>>> Stashed changes
        }
        catch {
          showErrorToast('Failed to update the todo.')
        }
      }
    },
    [todos, mutate, handleError],
  )

<<<<<<< Updated upstream
=======
  // Delete a todo by its ID
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            rollbackOnError: true,
            revalidate: false,
          },
        )

        dispatch({ type: 'DELETE_TODO', payload: todoId })
        showSuccessToast('Todo deleted successfully.')
=======
            revalidate: false,
            rollbackOnError: true,
          },
        )

        dispatch({ payload: todoId, type: 'DELETE_TODO' })
        toast.success('Todo deleted successfully.')
>>>>>>> Stashed changes
      }
      catch {
        showErrorToast('Failed to delete the todo.')
      }
    },
    [todos, mutate, handleError],
  )

<<<<<<< Updated upstream
  const handleEditClick = useCallback(
    (id: number) => {
=======
  // Handlers for UI actions (edit, delete, toggle)
  const handleEditClick = useCallback(
    (id: string) => {
>>>>>>> Stashed changes
      const newText = prompt('Enter the new text:')
      if (newText?.trim()) {
        handleUpdateTodo(id, newText.trim())
      }
    },
    [handleUpdateTodo],
  )

  const handleDeleteClick = useCallback(
<<<<<<< Updated upstream
    (id: number) => {
=======
    (id: string) => {
>>>>>>> Stashed changes
      if (window.confirm('Are you sure you want to delete this todo?')) {
        handleDeleteTodo(id)
      }
    },
    [handleDeleteTodo],
  )

  const handleToggleClick = useCallback(
<<<<<<< Updated upstream
    (id: number) => {
=======
    (id: string) => {
>>>>>>> Stashed changes
      handleToggleTodo(id)
    },
    [handleToggleTodo],
  )

<<<<<<< Updated upstream
=======
  // Memoized result for performance optimization
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    [
      todos,
      error,
      state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    ],
=======
    [error, todos, state.completedTodos, handleAddTodo, handleDeleteClick, handleEditClick, handleToggleClick],
>>>>>>> Stashed changes
  )
}

export default useTodoActions
