import { z } from "zod";

/**
 * Schema for a Todo item
 */
export const TodoSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }), // Ensures ID is a valid UUID
  text: z.string().trim().min(1, { message: "Text cannot be empty" }), // Removes whitespace and ensures text is not empty
  completed: z.boolean().default(false), // Default value is false
});

export type Todo = z.infer<typeof TodoSchema>;

/**
 * Schema for TodoForm props
 */
export const TodoFormPropsSchema = z.object({
  onAddTodo: z.custom<(text: string) => void>((fn) => typeof fn === "function", {
    message: "onAddTodo must be a function",
  }), // Ensures onAddTodo is a function
});

export type TodoFormProps = z.infer<typeof TodoFormPropsSchema>;

/**
 * Schema for TodoForm input props
 */
export const TodoFormInputPropsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name must be at least 1 characters" }) // Ensures minimum length of 1
    .max(20, { message: "Name must not exceed 20 characters" }), // Ensures maximum length of 20
});

export type TodoFormInputProps = z.infer<typeof TodoFormInputPropsSchema>;

/**
 * Schema for TodoList props
 */
export const TodoListPropsSchema = z.object({
  todos: z.array(TodoSchema), // Array of Todo objects
  error: z.boolean().optional().default(false), // Optional error flag, defaulting to false
  removeTodo: z.custom<(id: string) => void>((fn) => typeof fn === "function", {
    message: "removeTodo must be a function",
  }), // Ensures removeTodo is a function
  toggleTodo: z.custom<(id: string) => void>((fn) => typeof fn === "function", {
    message: "toggleTodo must be a function",
  }), // Ensures toggleTodo is a function
});

export type TodoListProps = z.infer<typeof TodoListPropsSchema>;
