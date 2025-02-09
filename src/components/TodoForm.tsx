import { zodResolver } from "@hookform/resolvers/zod";
import DOMPurify from "dompurify";
import { useForm } from "react-hook-form";

import type { TodoFormInputProps, TodoFormProps } from "../schema";
import { TodoFormInputPropsSchema } from "../schema";

function TodoForm({ onAddTodo }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormInputProps>({
    resolver: zodResolver(TodoFormInputPropsSchema),
  });

  const onSubmit = (data: TodoFormInputProps) => {
    const sanitizedInput = DOMPurify.sanitize(data.name.trim());

    if (sanitizedInput.length === 0) {
      return;
    }

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
          <input
            type="text"
            id="todo-input"
            className="block w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-900 transition-colors duration-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white focus:outline-none dark:focus:border-blue-500 dark:placeholder-gray-400"
            placeholder="Add a new todo item..."
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          Add
        </button>
      </div>
      {errors.name?.message && (
        <p className="mt-2 text-sm text-red-600 transition-colors duration-300 dark:text-red-500">
          {errors.name.message}
        </p>
      )}
    </form>
  );
}

export default TodoForm;
