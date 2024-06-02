import { useCallback, useEffect, useMemo, useReducer } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import api from '../api'
import { todoReducer } from '../reducer'
import type { Todo } from '../type'

function useTodoActions() {
  const { data: todos, mutate } = useSWR<Todo[]>('/api/todos', api.getTodos)
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    completedTodos: []
  })

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const completedTodos = await api.getCompletedTodos()
        dispatch({ type: 'SET_COMPLETED_TODOS', payload: completedTodos })
      } catch (error) {
        console.error('Failed to fetch completed todos.', error)
        toast.error('Unable to load completed todos.')
      }
    }
    fetchCompletedTodos()
  }, [])

  const handleAddTodo = useCallback(
    async (text: string) => {
      const trimmedText = text.trim()
      if (!trimmedText || todos?.some(todo => todo.text === trimmedText)) {
        toast.error('Todo text cannot be empty or duplicate.')
        return
      }

      const newTodo: Todo = { id: Date.now(), text: trimmedText }

      try {
        await mutate(
          async prevTodos => {
            await api.addTodo(newTodo)
            return [...(prevTodos || []), newTodo]
          },
          {
            optimisticData: [...(todos || []), newTodo],
            rollbackOnError: true,
            revalidate: false
          }
        )

        dispatch({ type: 'ADD_TODO', payload: newTodo })
        toast.success('Todo added successfully.')
      } catch (error) {
        toast.error('Failed to add the todo.')
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

        await api.updateTodo({ ...todo, completed: !isCompleted })
        if (isCompleted) {
          toast.success('Todo marked as incomplete.')
        } else {
          toast.success('Todo marked as complete.')
        }

        await api.saveCompletedTodos(updatedCompletedTodos)
      } catch (error) {
        toast.error('Failed to change todo completion status.')
        dispatch({ type: 'TOGGLE_TODO', payload: todoId })
        dispatch({ type: 'SET_COMPLETED_TODOS', payload: state.completedTodos })
      }
    },
    [todos, state.completedTodos]
  )

  const handleUpdateTodo = useCallback(
    async (todoId: number, newText: string) => {
      const trimmedText = newText.trim()
      if (!trimmedText) {
        toast.error('Todo text cannot be empty.')
        return
      }

      const todoItem = todos?.find(item => item.id === todoId)
      if (todoItem) {
        const updatedTodo = { ...todoItem, text: trimmedText }

        try {
          await mutate(
            async prevTodos => {
              await api.updateTodo(updatedTodo)
              return prevTodos
                ? prevTodos.map(item =>
                    item.id === todoId ? updatedTodo : item
                  )
                : [updatedTodo]
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
          toast.success('Todo updated successfully.')
        } catch (error) {
          toast.error('Failed to update the todo.')
        }
      }
    },
    [todos, mutate]
  )

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      try {
        await mutate(
          async prevTodos => {
            await api.deleteTodo(todoId)
            return prevTodos?.filter(todo => todo.id !== todoId)
          },
          {
            optimisticData: todos?.filter(todo => todo.id !== todoId),
            rollbackOnError: true,
            revalidate: false
          }
        )

        dispatch({ type: 'DELETE_TODO', payload: todoId })
        toast.success('Todo deleted successfully.')
      } catch (error) {
        toast.error('Failed to delete the todo.')
      }
    },
    [todos, mutate]
  )

  const handleEditClick = useCallback(
    (id: number) => {
      const newText = prompt('Enter the new text:')
      if (newText === null || newText.trim() === '') {
        // User pressed cancel or entered an empty string, do nothing
        return
      }

      const trimmedText = newText.trim()
      if (todos?.some(todo => todo.text === trimmedText)) {
        toast.error('Todo text already exists.')
      } else {
        handleUpdateTodo(id, trimmedText)
      }
    },
    [handleUpdateTodo, todos]
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
      completedTodos: state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick
    }),
    [
      todos,
      state.completedTodos,
      handleAddTodo,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick
    ]
  )
}

export default useTodoActions
