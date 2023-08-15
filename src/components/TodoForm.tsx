import type { FC, FormEvent } from 'react'
import { useState } from 'react'

interface TodoFormProps {
  onAddTodo: (text: string) => void
}

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('')

  /* The `const isInputEmpty = text.trim() === '';` line is checking if the trimmed value of the `text` state variable is
  an empty string. It removes any leading or trailing whitespace from the `text` value and compares it to an empty
  string. If the result is true, it means that the input is empty. */
  const isInputEmpty = text.trim() === ''

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!isInputEmpty) {
      onAddTodo(text)
      setText('')
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="add-todo" className="todo-label">
        Add Todo
      </label>
      <div className="todo-container">
        <div className="todo-icon">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="add-todo"
          className="todo-input"
          placeholder="Add Todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" className="todo-submit" disabled={!text.trim()}>
          Add Todo
        </button>
      </div>
    </form>
  )
}

export default TodoForm
