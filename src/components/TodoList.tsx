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
  const sortedTodos = useMemo(
    () => (todos ? [...todos].sort((a, b) => a.id - b.id) : []),
    [todos],
  )

  const todoList = useMemo(
    () =>
      sortedTodos.map((todo) => {
        const isTodoCompleted = completedTodos.includes(todo.id)

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
    [sortedTodos, completedTodos, handleEditClick, handleDeleteClick, handleToggleClick],
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
      {todoList.length > 0
        ? (
            todoList
          )
        : (
            <div className="text-center text-gray-500 py-4">
              No todos available. Add a new task!
            </div>
          )}
    </div>
  )
}

export default TodoList
