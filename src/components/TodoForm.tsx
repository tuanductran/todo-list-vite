import { Button, Description, Field, Input, Label } from '@headlessui/react'
import DOMPurify from 'dompurify'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'

import type { TodoFormProps } from '../type'

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm<{ name: string }>()

  const onSubmit = async (data: { name: string }) => {
    const isValid = await trigger('name')
    if (!isValid)
      return // Prevent submission if validation fails

    const sanitizedData = DOMPurify.sanitize(data.name)
    onAddTodo(sanitizedData)
    reset() // Reset the form after successful submission
  }

  return (
    <Field as="form" onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <Label htmlFor="add-todo" className="sr-only">
        Add new todo
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="size-4 text-gray-500 dark:text-gray-400"
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
        <Input
          type="text"
          id="add-todo"
          className="block w-full p-4 pl-10 pr-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 dark:text-white dark:focus:border-blue-500 transition-colors duration-300"
          placeholder="Enter a new todo..."
          {...register('name', {
            required: 'This field is required',
            minLength: { value: 3, message: 'Minimum 3 characters' },
            maxLength: { value: 20, message: 'Maximum 20 characters' },
          })}
          aria-invalid={errors.name ? 'true' : 'false'}
          autoComplete="off"
        />
        <Button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
        >
          Create
        </Button>
      </div>
      {errors.name && (
        <Description className="mt-2 text-sm text-red-600 dark:text-red-500 transition-colors duration-300">
          {errors.name.message}
        </Description>
      )}
    </Field>
  )
}

export default TodoForm
