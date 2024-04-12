import type { ChangeEvent, FC, FormEvent } from 'react'
import { useCallback, useState } from 'react'
import type { TodoFormProps } from '../type'

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('')

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault()
      const trimmedText = text.trim()
      if (trimmedText) {
        onAddTodo(trimmedText)
        setText('')
      }
    },
    [text, onAddTodo]
  )

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  const canSubmit = text.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="flex mt-4">
      <input
        type="text"
        name="name"
        id="add-todo"
        className="appearance-none border rounded w-full py-2 px-3 mr-4 text-gray-700"
        placeholder="Add new todo..."
        maxLength={29}
        value={text}
        onChange={handleChange}
        autoComplete="off"
        required
      />
      <button
        type="submit"
        className="shrink p-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded focus:outline-none disabled:opacity-25 disabled:pointer-events-none"
        disabled={!canSubmit}
      >
        Create
      </button>
    </form>
  )
}

export default TodoForm
