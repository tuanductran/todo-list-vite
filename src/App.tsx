import { useState } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { getTodos, addTodo } from './api'

interface Todo {
  id: number
  text: string
}

export default function App() {
  const { data, mutate } = useSWR<Todo[]>('/api/todos', getTodos)

  /* The line `const [completedTodos, setCompletedTodos] = useState<number[]>([])` is using the `useState` hook to create
  a state variable called `completedTodos` and a corresponding setter function called `setCompletedTodos`. The initial
  value of `completedTodos` is an empty array `[]`, and the type of the state variable is specified as `number[]` (an
  array of numbers). */
  const [completedTodos, setCompletedTodos] = useState<number[]>([])

  /**
   * The function `handleAddTodo` adds a new todo item to the local state and sends a request to update the data on the
   * server, with error handling and toast notifications.
   * @param {string} text - The `text` parameter is a string that represents the text of the new todo item that will be
   * added.
   */
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

  /**
   * The function `handleToggleCompletion` toggles the completion status of a todo item and displays a toast notification
   * accordingly.
   * @param {number} todoId - The `todoId` parameter is a number that represents the unique identifier of a todo item.
   */
  const handleToggleCompletion = (todoId: number) => {
    const updatedCompletedTodos = completedTodos.includes(todoId)
      ? completedTodos.filter((id) => id !== todoId)
      : [...completedTodos, todoId]
    setCompletedTodos(updatedCompletedTodos)

    // Show toast notification when a checkbox is checked or unchecked
    const todo = data?.find((item) => item.id === todoId)
    if (todo) {
      const message = completedTodos.includes(todoId)
        ? 'Todo marked as incomplete!'
        : 'Todo marked as completed!'
      toast.success(message, {
        icon: '🎉'
      })
    }
  }

  return (
    <div className="app-container">
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={data}
        completedTodos={completedTodos}
        handleToggleCompletion={handleToggleCompletion}
      />
    </div>
  )
}
