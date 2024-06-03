import { Button, Description, Field, Input, Label } from '@headlessui/react'
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

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }, [])

  return (
    <Field as="form" onSubmit={handleSubmit} className="flex mt-4">
      <Label htmlFor="add-todo" className="sr-only">
        Add new todo
      </Label>
      <Input
        type="text"
        name="name"
        id="add-todo"
        className="appearance-none border rounded-lg w-full py-2 px-3 mr-4 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        placeholder="Add new todo..."
        maxLength={29}
        value={text}
        onChange={handleChange}
        aria-describedby="todo-length-limit"
        autoComplete="off"
        required
      />
      <Description
        id="todo-length-limit"
        className="hidden text-xs text-red-500"
      >
        Maximum 29 characters
      </Description>
      <Button
        type="submit"
        className="shrink-0 p-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create
      </Button>
    </Field>
  )
}

export default TodoForm
