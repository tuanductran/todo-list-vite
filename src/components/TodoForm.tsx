import { Button, Description, Field, Input, Label } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import DOMPurify from "dompurify";
import type { FC } from "react";
import { useForm } from "react-hook-form";

import type { TodoFormInputProps, TodoFormProps } from "../schema";
import { TodoFormInputPropsSchema } from "../schema";

const TodoForm: FC<TodoFormProps> = ({ onAddTodo }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormInputProps>({
    resolver: zodResolver(TodoFormInputPropsSchema),
  });

  // Handle form submission with sanitized input
  const onSubmit = (data: TodoFormInputProps) => {
    const sanitizedInput = DOMPurify.sanitize(data.name);
    onAddTodo(sanitizedInput);
    reset(); // Clear the form after successful submission
  };

  return (
    <Field as="form" onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <Label htmlFor="todo-input" className="sr-only">
        New Todo
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="size-5 text-gray-500 dark:text-gray-400"
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
              d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <Input
          type="text"
          id="todo-input"
          className="block w-full px-4 pl-10 pr-20 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 transition-colors duration-300"
          placeholder="Add a new todo item..."
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
          autoComplete="off"
        />
        <Button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 transition-colors duration-300"
        >
          Add
        </Button>
      </div>
      {errors.name && (
        <Description className="mt-2 text-sm text-red-600 dark:text-red-500 transition-colors duration-300">
          {errors.name.message}
        </Description>
      )}
    </Field>
  );
};

export default TodoForm;
