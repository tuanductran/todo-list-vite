import { z } from "zod";

import {
  ADD_TODO,
  DELETE_TODO,
  SET_COMPLETED_TODOS,
  TOGGLE_TODO,
  UPDATE_TODO,
} from "./constants";

export const TodoSchema = z.object({
  id: z.any(),
  text: z.string(),
  completed: z.boolean().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodoFormPropsSchema = z.object({
  onAddTodo: z.function().args(z.string()).returns(z.void()),
});

export type TodoFormProps = z.infer<typeof TodoFormPropsSchema>;

export const TodoFormInputPropsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters" })
    .max(20, { message: "Maximum 20 characters" }),
});

export type TodoFormInputProps = z.infer<typeof TodoFormInputPropsSchema>;

export const TodoListPropsSchema = z.object({
  todos: z.array(TodoSchema),
  error: z.boolean(),
  completedTodos: z.array(z.string()),
  handleEditClick: z.function().args(z.string()).returns(z.void()),
  handleDeleteClick: z.function().args(z.string()).returns(z.void()),
  handleToggleClick: z.function().args(z.string()).returns(z.void()),
});

export type TodoListProps = z.infer<typeof TodoListPropsSchema>;

export const StateSchema = z.object({
  todos: z.array(TodoSchema),
  completedTodos: z.array(z.string()),
});

export type State = z.infer<typeof StateSchema>;

export const ActionSchema = z.union([
  z.object({
    type: z.literal(SET_COMPLETED_TODOS),
    payload: z.array(z.string()),
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
    payload: z.string(),
  }),
  z.object({
    type: z.literal(TOGGLE_TODO),
    payload: z.string(),
  }),
]);

export type Action = z.infer<typeof ActionSchema>;
