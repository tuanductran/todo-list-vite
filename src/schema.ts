import { z } from "zod";

import {
  ADD_TODO,
  DELETE_TODO,
  SET_COMPLETED_TODOS,
  TOGGLE_TODO,
  UPDATE_TODO,
} from "./constants";

export const TodoSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }),
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
  completedTodos: z.array(z.string().uuid({ message: "Invalid ID format in completedTodos" })),
  handleDeleteClick: z.function().args(z.string()).returns(z.void()),
  handleToggleClick: z.function().args(z.string()).returns(z.void()),
});

export type TodoListProps = z.infer<typeof TodoListPropsSchema>;

export const StateSchema = z.object({
  todos: z.array(TodoSchema),
  completedTodos: z.array(z.string().uuid({ message: "Invalid ID format in completedTodos" })),
});

export type State = z.infer<typeof StateSchema>;

export const ActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(SET_COMPLETED_TODOS),
    payload: z.array(z.string().uuid({ message: "Invalid ID format in payload" })),
  }),
  z.object({
    type: z.literal(ADD_TODO),
    payload: TodoSchema,
  }),
  z.object({
    type: z.literal(UPDATE_TODO),
    payload: TodoSchema,
  }),
  z.object({
    type: z.literal(DELETE_TODO),
    payload: z.string().uuid({ message: "Invalid ID format in payload" }),
  }),
  z.object({
    type: z.literal(TOGGLE_TODO),
    payload: z.string().uuid({ message: "Invalid ID format in payload" }),
  }),
]);

export type Action = z.infer<typeof ActionSchema>;
