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

  const onSubmit = (data: TodoFormInputProps) => {
    const sanitizedInput = DOMPurify.sanitize(data.name);
    onAddTodo(sanitizedInput);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <label htmlFor="todo-input" className="sr-only">
        New Todo
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
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
          <input
            type="text"
            id="todo-input"
            className="block w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2 pl-10 text-sm text-gray-900 transition-colors duration-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white focus:outline-none dark:focus:border-blue-500 dark:placeholder-gray-400"
            placeholder="Add a new todo item..."
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Add
        </button>
      </div>
      {errors.name && (
        <p className="mt-2 text-sm text-red-600 transition-colors duration-300 dark:text-red-500">
          {errors.name.message}
        </p>
      )}
    </form>
  );
};

export default TodoForm;
