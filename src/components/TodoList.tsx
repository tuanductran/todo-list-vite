import type { FC } from 'react'
import { useMemo } from 'react'

import type { TodoListProps } from '../schema'

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
<<<<<<< Updated upstream
    () => [...(todos || [])].sort((a, b) => a.id - b.id),
=======
    () => (todos ? [...todos].sort((a, b) => Number(a.id) - Number(b.id)) : []),
>>>>>>> Stashed changes
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
    [
      sortedTodos,
      completedTodos,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    ],
  )

  return (
<<<<<<< Updated upstream
    <div
      className={cn('overflow-auto h-full', {
        'max-h-[300px]': todos && todos.length > 4,
      })}
    >
      {error
=======
    <div className="h-full">
      {todoList.length > 0
>>>>>>> Stashed changes
        ? (
            <div className="text-center text-gray-500 py-4">
              No todos available. Please try again later!
            </div>
          )
        : todoList.length > 0
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
