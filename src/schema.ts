import { z } from "zod";

export const TodoSchema = z.object({
  text: z.string().min(1, { message: "Text cannot be empty" }),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodoFormPropsSchema = z.object({
  onAddTodo: z.function().args(z.string()).returns(z.void()),
});

export type TodoFormProps = z.infer<typeof TodoFormPropsSchema>;

export const TodoFormInputPropsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name must not exceed 20 characters" }),
});

export type TodoFormInputProps = z.infer<typeof TodoFormInputPropsSchema>;

export const TodoListPropsSchema = z.object({
  todos: z.array(TodoSchema),
  error: z.boolean().default(false),
  completedTodos: z.array(z.string().min(1, { message: "Invalid text format in completedTodos" })),
  handleDeleteClick: z.function().args(z.string()).returns(z.void()),
  handleToggleClick: z.function().args(z.string()).returns(z.void()),
});

export type TodoListProps = z.infer<typeof TodoListPropsSchema>;
