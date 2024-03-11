import type { FC, FormEvent, ChangeEvent, useEffect } from 'react'
import { useState } from 'react'
import DOMPurify from 'dompurify'
import { TodoFormProps } from '../type'

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('')
  const [isInputEmpty, setIsInputEmpty] = useState(true)

  useEffect(() => {
    setIsInputEmpty(text.trim() === '')
  }, [text])

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!isInputEmpty) {
      const sanitizedText = DOMPurify.sanitize(text)
      onAddTodo(sanitizedText)
      setText('')
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
    setText(capitalizedValue)
  }

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
        onChange={handleInputChange}
        required
      />
      <button
        type="submit"
        className="shrink p-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded focus:outline-none disabled:opacity-25 disabled:pointer-events-none"
        disabled={isInputEmpty}
      >
        Create
      </button>
    </form>
  )
}

export default TodoForm
