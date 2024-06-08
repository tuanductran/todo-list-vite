import { useCallback, useEffect, useMemo, useReducer } from 'react'
import useSWR from 'swr'
import {
  addTodo,
  deleteTodo,
  getCompletedTodos,
  getTodos,
  saveCompletedTodos,
  updateTodo
} from '../api'
import { showErrorToast, showSuccessToast } from '../components/Toast'
import { todoReducer } from '../reducer'
import type { Todo } from '../type'

const useTodoActions = () => {
  const {
    data: todos,
    error,
    mutate
  } = useSWR<Todo[]>('/api/todos', getTodos, {
    refreshInterval: 1000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
    shouldRetryOnError: true
  })

  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    completedTodos: []
  })

  useEffect(() => {
    if (error) {
      showErrorToast(error.message)
    }
  }, [error])

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const completedTodos = await getCompletedTodos()
        dispatch({ type: 'SET_COMPLETED_TODOS', payload: completedTodos })
      } catch {
        showErrorToast('Unable to load completed todos.')
      }
    }
    fetchCompletedTodos()
  }, [])

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

      const newTodo: Todo = {
        id: Date.now(),
        text: trimmedText,
        completed: false
      }

      try {
        await mutate(
          async (prevTodos = []) => {
            await addTodo(newTodo)
            return [...prevTodos, newTodo]
          },
          {
            optimisticData: [...(todos || []), newTodo],
            rollbackOnError: true,
            revalidate: false
          }
        )

        dispatch({ type: 'ADD_TODO', payload: newTodo })
        showSuccessToast('Todo added successfully.')
      } catch {
        showErrorToast('Failed to add the todo.')
      }
    },
    [todos, mutate]
  )

  const handleToggleTodo = useCallback(
    async (todoId: number) => {
      const todo = todos?.find(todo => todo.id === todoId)
      if (!todo) return

      const isCompleted = state.completedTodos.includes(todoId)
      const updatedCompletedTodos = isCompleted
        ? state.completedTodos.filter(id => id !== todoId)
        : [...state.completedTodos, todoId]

      try {
        dispatch({ type: 'TOGGLE_TODO', payload: todoId })
        dispatch({
          type: 'SET_COMPLETED_TODOS',
          payload: updatedCompletedTodos
        })

        await mutate(
          async (prevTodos = []) => {
            await updateTodo({ ...todo, completed: !isCompleted })
            return prevTodos.map(item =>
              item.id === todoId ? { ...item, completed: !isCompleted } : item
            )
          },
          {
            optimisticData: todos?.map(item =>
              item.id === todoId ? { ...item, completed: !isCompleted } : item
            ),
            rollbackOnError: true,
            revalidate: false
          }
        )

        showSuccessToast(
          isCompleted
            ? 'Todo marked as incomplete.'
            : 'Todo marked as complete.'
        )
        await saveCompletedTodos(updatedCompletedTodos)
      } catch {
        showErrorToast('Failed to change todo completion status.')
        dispatch({ type: 'TOGGLE_TODO', payload: todoId })
        dispatch({ type: 'SET_COMPLETED_TODOS', payload: state.completedTodos })
      }
    },
    [todos, state.completedTodos, mutate]
  )

  const handleUpdateTodo = useCallback(
    async (todoId: number, newText: string) => {
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
              return prevTodos.map(item =>
                item.id === todoId ? updatedTodo : item
              )
            },
            {
              optimisticData: todos?.map(item =>
                item.id === todoId ? updatedTodo : item
              ),
              rollbackOnError: true,
              revalidate: false
            }
          )

          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo })
          showSuccessToast('Todo updated successfully.')
        } catch {
          showErrorToast('Failed to update the todo.')
        }
      }
    },
    [todos, mutate]
  )

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      try {
        await mutate(
          async (prevTodos = []) => {
            await deleteTodo(todoId)
            return prevTodos.filter(todo => todo.id !== todoId)
          },
          {
            optimisticData: todos?.filter(todo => todo.id !== todoId),
            rollbackOnError: true,
            revalidate: false
          }
        )

        dispatch({ type: 'DELETE_TODO', payload: todoId })
        showSuccessToast('Todo deleted successfully.')
      } catch {
        showErrorToast('Failed to delete the todo.')
      }
    },
    [todos, mutate]
  )

  const handleEditClick = useCallback(
    (id: number) => {
      const newText = prompt('Enter the new text:')
      if (newText?.trim()) {
        handleUpdateTodo(id, newText.trim())
      }
    },
    [handleUpdateTodo]
  )

  const handleDeleteClick = useCallback(
    (id: number) => {
      if (window.confirm('Are you sure you want to delete this todo?')) {
        handleDeleteTodo(id)
      }
    },
    [handleDeleteTodo]
  )

  const handleToggleClick = useCallback(
    (id: number) => {
      handleToggleTodo(id)
    },
    [handleToggleTodo]
  )

  return useMemo(
    () => ({
      todos,
      error,
      completedTodos: state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick
    }),
    [
      todos,
      error,
      state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick
    ]
  )
}

export default useTodoActions
