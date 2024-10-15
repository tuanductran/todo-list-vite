import { z } from 'zod'

// Todo Schema
const TodoSchema = z.strictObject({
  completed: z.boolean().optional(),
  id: z.string(),
  text: z.string(),
})

// Action Schema
const ActionSchema = z.union([
  z.object({
    payload: z.array(z.string()),
    type: z.literal('SET_COMPLETED_TODOS'),
  }),
  z.object({
    payload: TodoSchema,
    type: z.literal('ADD_TODO'),
  }),
  z.object({
    payload: TodoSchema,
    type: z.literal('UPDATE_TODO'),
  }),
  z.object({
    payload: z.string(),
    type: z.literal('DELETE_TODO'),
  }),
  z.object({
    payload: z.string(),
    type: z.literal('TOGGLE_TODO'),
  }),
])

// State Schema
const StateSchema = z.strictObject({
  completedTodos: z.array(z.string()),
  todos: z.array(TodoSchema),
})

// TodoFormProps Schema
const TodoFormPropsSchema = z.strictObject({
  onAddTodo: z.function().args(z.string()).returns(z.void()),
})

// TodoListProps Schema
const TodoListPropsSchema = z.strictObject({
  completedTodos: z.array(z.string()),
  error: z.boolean(),
  handleDeleteClick: z.function().args(z.string()).returns(z.void()),
  handleEditClick: z.function().args(z.string()).returns(z.void()),
  handleToggleClick: z.function().args(z.string()).returns(z.void()),
  todos: z.array(TodoSchema),
})

// TypeScript type definition from Zod schema
export type Action = z.infer<typeof ActionSchema>
export type State = z.infer<typeof StateSchema>
export type Todo = z.infer<typeof TodoSchema>
export type TodoFormProps = z.infer<typeof TodoFormPropsSchema>
export type TodoListProps = z.infer<typeof TodoListPropsSchema>
