import cn from 'clsx'
import type { FC } from 'react'
import { useMemo } from 'react'

import type { TodoListProps } from '../type'
import TodoItem from './TodoItem'

const TodoList: FC<TodoListProps> = ({
  todos,
  error,
  completedTodos,
  handleEditClick,
  handleDeleteClick,
  handleToggleClick,
}) => {
  // Use Set for faster lookup of completed todos
  const completedTodosSet = useMemo(() => new Set(completedTodos), [completedTodos])

  // Memoize sorted todos
  const sortedTodos = useMemo(() => {
    if (todos) {
      return [...todos].sort((a, b) => a.id - b.id)  // Sorting only when todos change
    }
    return []
  }, [todos])

  // Memoize the todoList render to avoid unnecessary re-renders
  const todoList = useMemo(
    () =>
      sortedTodos.map((todo) => {
        const isTodoCompleted = completedTodosSet.has(todo.id)

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isCompleted={isTodoCompleted}
            onToggle={() => handleToggleClick(todo.id)}
            onEdit={() => handleEditClick(todo.id)}
            onDelete={() => handleDeleteClick(todo.id)}
          />
        )
      }),
    [sortedTodos, completedTodosSet, handleEditClick, handleDeleteClick, handleToggleClick],
  )

  if (error) {
    return (
      <div className="text-center text-gray-500 py-4">
        Something went wrong. Please try again later!
      </div>
    )
  }

  return (
    <div className={cn('overflow-auto h-full', { 'max-h-[300px]': sortedTodos.length > 4 })}>
      {todoList.length > 0 ? (
        todoList
      ) : (
        <div className="text-center text-gray-500 py-4">
          No todos available. Add a new task!
        </div>
      )}
    </div>
  )
}

export default TodoList
