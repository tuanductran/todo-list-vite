import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { useTodos } from '../api'
import type { Todo } from '../type'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

export default function TodoPage() {
  const [todos, addTodo, updateTodo, deleteTodo, getTodos] = useTodos()
  const { data, mutate } = useSWR<Todo[]>('/api/todos', getTodos)

  // State for completed todos
  const [completedTodos, setCompletedTodos] = useState<number[]>([])

  // Load completed todos from Local Storage if available
  useEffect(() => {
    const storedCompletedTodos = localStorage.getItem('completedTodos')
    if (storedCompletedTodos) {
      setCompletedTodos(JSON.parse(storedCompletedTodos))
    }
  }, [])

  // Save completed todos to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos))
  }, [completedTodos])

  // Handle adding a new todo
  const handleAddTodo = async (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text
    }

    try {
      // Update the local state immediately and fire the
      // request. Since the API will return the updated
      // data, there is no need to start a new revalidation
      // and we can directly populate the cache.
      await mutate(addTodo(newTodo), {
        optimisticData: data ? [...data, newTodo] : [newTodo],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
      })
      toast.success('Successfully added the new item.')
    } catch (e) {
      // If the API errors, the original data will be
      // rolled back by SWR automatically.
      toast.error('Failed to add the new item.')
    }
  }

  // Handle toggling completion of a todo
  const handleToggleCompletion = (todoId: number) => {
    const updatedCompletedTodos = completedTodos.includes(todoId)
      ? completedTodos.filter(id => id !== todoId)
      : [...completedTodos, todoId]
    setCompletedTodos(updatedCompletedTodos)

    // Show toast notification when a checkbox is checked or unchecked
    const todo = data?.find(item => item.id === todoId)
    if (todo) {
      const message = completedTodos.includes(todoId)
        ? 'Todo marked as incomplete!'
        : 'Todo marked as completed!'
      toast.success(message, {
        icon: '🎉'
      })
    }
  }

  // Handle updating a todo
  const handleUpdateTodo = async (todoId: number, newText: string) => {
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
  }

  // Handle deleting a todo
  const handleDeleteTodo = async (todoId: number) => {
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
  }

  return (
    <div className="size-full flex items-center justify-center">
      <div className="bg-white rounded p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="block text-gray-800 text-2xl sm:text-3xl font-bold">Todo List</h1>
          <TodoForm onAddTodo={handleAddTodo} />
        </div>
        <TodoList
          todos={data || []}
          completedTodos={completedTodos}
          handleToggleCompletion={handleToggleCompletion}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
      </div>
    </div>
  )
}
