import { Button } from '@headlessui/react'
import cn from 'clsx'
import type { FC } from 'react'
import { memo } from 'react'

import type { Todo } from '../type'

const TodoItem: FC<{
  todo: Todo
  isCompleted: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}> = memo(
  ({ todo, isCompleted, onToggle, onEdit, onDelete }) => {
    const textClass = isCompleted
      ? 'line-through text-gray-800 dark:text-gray-400'
      : 'text-gray-900 dark:text-gray-100'
    const toggleButtonClass = isCompleted
      ? 'bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
      : 'bg-green-800 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500'

    return (
      <div className="flex py-2 items-center">
        <p
          className={cn(
            'mr-auto text-ellipsis overflow-hidden transition-colors duration-300',
            textClass,
          )}
        >
          {todo.text}
        </p>
        <Button
          type="button"
          className={cn(
            'shrink-0 p-2 ml-4 text-sm font-medium rounded-lg transition-colors duration-300',
            toggleButtonClass,
          )}
          onClick={onToggle}
        >
          {isCompleted ? 'Unmark' : 'Complete'}
        </Button>
        {!isCompleted && (
          <Button
            type="button"
            className="shrink-0 p-2 ml-4 text-sm font-medium rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors duration-300"
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
        <Button
          type="button"
          className="shrink-0 p-2 ml-4 text-sm font-medium rounded-lg bg-red-800 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-500 transition-colors duration-300"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    )
  },
  (prevProps, nextProps) =>
    prevProps.isCompleted === nextProps.isCompleted &&
    prevProps.todo === nextProps.todo,
)

TodoItem.displayName = 'TodoItem'

export default TodoItem
