import type { FC } from 'react'
import { Fragment } from 'react'
import cn from 'clsx'

interface Todo {
  id: number
  text: string
}

interface TodoListProps {
  todos: Todo[]
  completedTodos: number[] // Assuming the array contains the IDs of completed todos
  handleToggleCompletion: (todoId: number) => void
}

const TodoList: FC<TodoListProps> = ({
  todos,
  completedTodos,
  handleToggleCompletion
}) => {
  return (
    <Fragment>
      {todos && (
        <ul className="todo-list">
          {todos.map((todo) => {
            const isTodoCompleted = completedTodos.includes(todo.id)
            return (
              <li key={todo.id} className={cn(`${isTodoCompleted && "completed"}`)}>
                <div className="todo-list-checkbox-container">
                  <input
                    id={`${todo.id}-checkbox-list`}
                    type="checkbox"
                    className="todo-list-checkbox-input"
                    checked={isTodoCompleted}
                    onChange={() => handleToggleCompletion(todo.id)}
                  />
                  <label
                    htmlFor={`${todo.id}-checkbox-list`}
                    className="todo-list-checkbox-label"
                  >
                    {todo.text}
                  </label>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Fragment>
  )
}

export default TodoList
