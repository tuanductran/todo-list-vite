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
      className={cn('overflow-auto h-fit', {
        'max-h-[300px]': todos?.length > 4
      })}
    >
      {todos?.map((todo) => {
        const isTodoCompleted = completedTodos.includes(todo.id);
        return (
          <div key={todo.id} className="flex mb-4 last:mb-0 items-center">
            <p
              className={cn('mr-auto text-ellipsis overflow-hidden', {
                'line-through text-sky-500': isTodoCompleted,
              })}
            >
              {todo.text}
            </p>
            {isTodoCompleted ? (
              <button
                type="button"
                className="shrink p-2 ml-4 rounded bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                onClick={() => handleToggleClick(todo.id)}
              >
                Not Done
              </button>
            ) : (
              <button
                type="button"
                className="shrink p-2 ml-4 rounded bg-sky-200 hover:bg-sky-300 text-sky-500 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={() => handleToggleClick(todo.id)}
              >
                Done
              </button>
            )}
            {!isTodoCompleted && (
              <button
                type="button"
                className="shrink p-2 ml-4 rounded bg-teal-200 hover:bg-teal-300 text-teal-500 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={() => handleEditClick(todo.id)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="shrink p-2 ml-4 rounded bg-red-200 hover:bg-red-300 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => handleDeleteClick(todo.id)}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  )
}

export default TodoList
