import cn from 'clsx'
import type { FC } from 'react'
import type { TodoListProps } from '../type'

const TodoList: FC<TodoListProps> = ({
  todos,
  completedTodos,
  handleEditClick,
  handleDeleteClick,
  handleToggleClick
}) => {
  return (
    <div
      className={cn({
        'overscroll-contain overflow-auto h-72': todos?.length > 4
      })}
    >
      {todos?.map(todo => {
        const isTodoCompleted = completedTodos.includes(todo.id)
        return (
          <div key={todo.id} className="flex mb-4 last:mb-0 items-center">
            <p
              className={cn('mr-auto truncate line-clamp-2 w-1/2', {
                'line-through text-sky-500': isTodoCompleted
              })}
            >
              {todo.text}
            </p>
            {isTodoCompleted ? (
              <button
                type="button"
                className="shrink p-2 ml-4 border-2 rounded hover:text-white text-gray-500 border-gray-500 hover:bg-gray-500"
                onClick={() => handleToggleClick(todo.id)}
              >
                Not Done
              </button>
            ) : (
              <button
                type="button"
                className="shrink p-2 ml-4 border-2 rounded hover:text-white text-sky-500 border-sky-500 hover:bg-sky-500"
                onClick={() => handleToggleClick(todo.id)}
              >
                Done
              </button>
            )}
            {!isTodoCompleted && (
              <button
                type="button"
                className="shrink p-2 ml-4 border-2 rounded hover:text-white text-teal-500 border-teal-500 hover:bg-teal-500"
                onClick={() => handleEditClick(todo.id)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="shrink p-2 ml-4 border-2 rounded hover:text-white text-red-500 border-red-500 hover:bg-red-500"
              onClick={() => handleDeleteClick(todo.id)}
            >
              Delete
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default TodoList
