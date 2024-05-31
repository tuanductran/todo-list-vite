import type { ChangeEvent, FC, FormEvent } from 'react'
import { useCallback, useState } from 'react'
import type { TodoFormProps } from '../type'

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('')

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const trimmedText = text.trim()
      if (trimmedText) {
        onAddTodo(trimmedText)
        setText('')
      }
    },
    [text, onAddTodo]
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value)
    },
    []
  )

  return (
    <form onSubmit={handleSubmit} className="flex mt-4">
      <label htmlFor="add-todo" className="sr-only">
        Add new todo
      </label>
      <input
        type="text"
        name="name"
        id="add-todo"
        className="appearance-none border rounded w-full py-2 px-3 mr-4 text-gray-700 focus:ring-sky-500 focus:border-sky-500"
        placeholder="Add new todo..."
        maxLength={29}
        value={text}
        onChange={handleChange}
        aria-describedby="todo-length-limit"
        autoComplete="off"
        required
      />
      <span id="todo-length-limit" className="hidden text-xs text-red-500">
        Maximum 29 characters
      </span>
      <button
        type="submit"
        className="shrink p-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded focus:outline-none"
      >
        Create
      </button>
    </form>
  )
}

export default TodoForm