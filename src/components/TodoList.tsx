import type { FC, useCallback } from 'react'
import cn from 'clsx'
import { Todo, TodoListProps } from '../type'

const TodoList: FC<TodoListProps> = ({
  todos = [],
  completedTodos,
  handleToggleCompletion,
  handleUpdateTodo,
  handleDeleteTodo
}) => {
  const handleEditClick = useCallback((todoId: string) => {
    const newText = prompt('Enter the new text:')
    if (newText !== null) {
      handleUpdateTodo(todoId, newText)
    }
  }, [handleUpdateTodo])

  const handleDeleteClick = useCallback((todoId: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      handleDeleteTodo(todoId)
    }
  }, [handleDeleteTodo])

  return (
    <div>
      <div>
        {todos.map((todo) => {
          const isTodoCompleted = completedTodos.includes(todo.id)
          return (
            <div key={todo.id} className="flex mb-4 last:mb-0 items-center">
              <p className={cn('mr-auto truncate line-clamp-2 w-1/2', {
                "text-sky-500" : isTodoCompleted
              })}>
                {todo.text}
              </p>
              {!isTodoCompleted && (
                <>
                  <button
                    type="button"
                    className="shrink p-2 ml-4 border-2 rounded hover:text-white text-sky-500 border-sky-500 hover:bg-sky-500"
                    onClick={() => handleToggleCompletion(todo.id)}
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    className="shrink p-2 ml-4 border-2 rounded hover:text-white text-teal-500 border-teal-500 hover:bg-teal-500"
                    onClick={() => handleEditClick(todo.id)}
                  >
                    Edit
                  </button>
                </>
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
    </div>
  )
}

export default TodoList
