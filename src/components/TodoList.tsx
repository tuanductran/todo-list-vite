import cn from 'clsx'
import { useState } from 'react'
import type { FC } from 'react'
import type {
  TodoListFilterButtonProps,
  TodoListFilterType,
  TodoListProps
} from '../type'

const FilterButton: FC<TodoListFilterButtonProps> = ({
  filterType,
  setFilter,
  currentFilter,
  children
}) => (
  <li className="mr-2">
    <button
      className={cn(
        'inline-block p-4 border-b-2',
        currentFilter === filterType
          ? 'text-sky-500 border-sky-500'
          : 'border-transparent hover:text-sky-500 hover:border-sky-500'
      )}
      onClick={() => setFilter(filterType)}
    >
      {children}
    </button>
  </li>
)

const TodoList: FC<TodoListProps> = ({
  todos,
  completedTodos,
  handleEditClick,
  handleDeleteClick,
  handleToggleClick
}) => {
  const [filter, setFilter] = useState<TodoListFilterType>('all')

  const getFilteredTodos = () => {
    return todos.filter(todo => {
      if (filter === 'active') return !completedTodos.includes(todo.id)
      if (filter === 'completed') return completedTodos.includes(todo.id)
      return true
    })
  }

  const filteredTodos = getFilteredTodos()

  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-500">
        <ul className="flex flex-wrap -mb-px">
          <FilterButton
            filterType="all"
            setFilter={setFilter}
            currentFilter={filter}
          >
            All
          </FilterButton>
          <FilterButton
            filterType="active"
            setFilter={setFilter}
            currentFilter={filter}
          >
            Active
          </FilterButton>
          <FilterButton
            filterType="completed"
            setFilter={setFilter}
            currentFilter={filter}
          >
            Completed
          </FilterButton>
        </ul>
      </div>
      <div
        className={cn('mt-4', {
          'overscroll-contain overflow-auto h-72': filteredTodos.length > 4
        })}
      >
        {filteredTodos.map(todo => {
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
              <button
                type="button"
                className={cn(
                  'shrink p-2 ml-4 border-2 rounded hover:text-white',
                  isTodoCompleted
                    ? 'text-gray-500 border-gray-500 hover:bg-gray-500'
                    : 'text-sky-500 border-sky-500 hover:bg-sky-500'
                )}
                onClick={() => handleToggleClick(todo.id)}
              >
                {isTodoCompleted ? 'Not Done' : 'Done'}
              </button>
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
    </>
  )
}

export default TodoList
