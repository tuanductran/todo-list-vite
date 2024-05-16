import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { addTodo, deleteTodo, getTodos, updateTodo } from '../api'
import type { Todo } from '../type'

function useTodoActions() {
  const { data, mutate } = useSWR<Todo[]>('/api/todos', getTodos)
  const completedTodos = useRef<number[]>([])

  useEffect(() => {
    const storedCompletedTodos = localStorage.getItem('completedTodos')
    if (storedCompletedTodos) {
      completedTodos.current = JSON.parse(storedCompletedTodos)
    }
  }, [])

  useEffect(() => {
    const saveCompletedTodos = () => {
      localStorage.setItem('completedTodos', JSON.stringify(completedTodos.current))
    }

    window.addEventListener('beforeunload', saveCompletedTodos)

    return () => {
      window.removeEventListener('beforeunload', saveCompletedTodos)
    }
  }, [])

  const handleAddTodo = useCallback(
    async (text: string) => {
      text = text.trim()
      if (!text) {
        toast.error('Todo text cannot be empty.')
        return
      }

      const isTodoExist = data?.some(todo => todo.text === text)
      if (isTodoExist) {
        toast.error('A todo list with this name already exists.')
        return
      }

      const newTodo: Todo = {
        id: Date.now(),
        text
      }

      try {
        await mutate(addTodo(newTodo), {
          optimisticData: data ? [...data, newTodo] : [newTodo],
          rollbackOnError: true,
          populateCache: true,
          revalidate: false
        })
        toast.success('Successfully added the new item.')
      } catch (e) {
        toast.error('Failed to add the new item.')
      }
    },
    [data, mutate]
  )

  const handleToggleTodo = useCallback(
    (todoId: number) => {
      completedTodos.current = completedTodos.current.includes(todoId)
        ? completedTodos.current.filter(id => id !== todoId)
        : [...completedTodos.current, todoId]

      const todo = data?.find(item => item.id === todoId)
      if (todo) {
        const message = completedTodos.current.includes(todoId)
          ? 'Todo marked as incomplete!'
          : 'Todo marked as completed!'
        toast.success(message, {
          icon: '🎉'
        })
      }
    },
    [data]
  )

  const handleUpdateTodo = useCallback(
    async (todoId: number, newText: string) => {
      newText = newText.trim()
      if (!newText) {
        toast.error('Todo text cannot be empty.')
        return
      }

      try {
        const todoItem = data?.find(item => item.id === todoId)
        if (todoItem) {
          const updatedTodo = { ...todoItem, text: newText }
          await mutate(updateTodo(updatedTodo), {
            optimisticData: data?.map(item =>
              item.id === todoId ? updatedTodo : item
            ),
            rollbackOnError: true,
            revalidate: false
          })
          toast.success('Successfully updated the item.')
        } else {
          toast.error('Todo item not found')
        }
      } catch (e) {
        toast.error('Failed to update the item.')
      }
    },
    [data, mutate]
  )

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      try {
        await mutate(deleteTodo(todoId), {
          optimisticData: data?.filter(item => item.id !== todoId),
          rollbackOnError: true,
          revalidate: false
        })
        toast.success('Successfully deleted the item.')
      } catch (e) {
        toast.error('Failed to delete the item.')
      }
    },
    [data, mutate]
  )

  const handleEditClick = useCallback(
    (id: number) => {
      const newText = prompt('Enter the new text:')
      if (newText !== null) {
        const isTodoExist = data?.some(todo => todo.text === newText)
        if (isTodoExist) {
          toast.error('A todo list with this name already exists.')
          return
        }
        handleUpdateTodo(id, newText)
      }
    },
    [handleUpdateTodo, data]
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

  return {
    todos: data,
    completedTodos: completedTodos.current,
    handleAddTodo,
    handleEditClick,
    handleDeleteClick,
    handleToggleClick
  }
}

export default useTodoActions
