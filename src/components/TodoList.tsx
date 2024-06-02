import { Button } from '@headlessui/react'
import cn from 'clsx'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { TodoListProps } from '../type'

const TodoList: FC<TodoListProps> = ({
  todos,
  completedTodos,
  handleEditClick,
  handleDeleteClick,
  handleToggleClick
}) => {
  const todoList = useMemo(() => {
    return todos?.map(todo => {
      const isTodoCompleted = completedTodos.includes(todo.id)
      return (
        <div key={todo.id} className="flex mb-4 last:mb-0 items-center">
          <p
            className={cn(
              'mr-auto text-ellipsis overflow-hidden transition-colors duration-300',
              {
                'line-through text-blue-700 dark:text-blue-300':
                  isTodoCompleted,
                'text-gray-900 dark:text-gray-100': !isTodoCompleted
              }
            )}
          >
            {todo.text}
          </p>
          <Button
            type="button"
            className={cn(
              'shrink-0 p-2 ml-4 rounded transition-colors duration-300',
              {
                'bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100':
                  isTodoCompleted,
                'bg-blue-300 hover:bg-blue-400 text-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-blue-100':
                  !isTodoCompleted
              }
            )}
            onClick={() => handleToggleClick(todo.id)}
          >
            {isTodoCompleted ? 'Not Done' : 'Done'}
          </Button>
          {!isTodoCompleted && (
            <Button
              type="button"
              className="shrink-0 p-2 ml-4 rounded bg-teal-300 hover:bg-teal-400 text-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 dark:text-teal-100 transition-colors duration-300"
              onClick={() => handleEditClick(todo.id)}
            >
              Edit
            </Button>
          )}
          <Button
            type="button"
            className="shrink-0 p-2 ml-4 rounded bg-red-300 hover:bg-red-400 text-red-900 dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-100 transition-colors duration-300"
            onClick={() => handleDeleteClick(todo.id)}
          >
            Delete
          </Button>
        </div>
      )
    })
  }, [
    todos,
    completedTodos,
    handleEditClick,
    handleDeleteClick,
    handleToggleClick
  ])

  return (
    <div
      className={cn('overflow-auto h-full', {
        'max-h-[300px]': todos?.length > 4
      })}
    >
      {todoList}
    </div>
  )
}

export default TodoList
