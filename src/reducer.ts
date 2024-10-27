import type { Action, State, Todo } from './type'

enum ActionTypes {
  SetCompletedTodos = 'SET_COMPLETED_TODOS',
  AddTodo = 'ADD_TODO',
  UpdateTodo = 'UPDATE_TODO',
  DeleteTodo = 'DELETE_TODO',
  ToggleTodo = 'TOGGLE_TODO',
}

export function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.SetCompletedTodos:
      // Avoid unnecessary state update if the payload is identical
      return state.completedTodos !== action.payload
        ? { ...state, completedTodos: action.payload }
        : state

    case ActionTypes.AddTodo:
      // Check for duplicate Todo (based on unique ID or content) before adding
      if (!state.todos.find(todo => todo.id === action.payload.id)) {
        return { ...state, todos: [...state.todos, action.payload] }
      }
      return state

    case ActionTypes.UpdateTodo:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo,
        ),
      }

    case ActionTypes.DeleteTodo:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      }

    case ActionTypes.ToggleTodo: {
      const { completedTodos } = state
      const isCompleted = completedTodos.includes(action.payload)
      const newCompletedTodos = isCompleted
        ? completedTodos.filter(id => id !== action.payload)
        : [...completedTodos, action.payload]

      return {
        ...state,
        completedTodos: newCompletedTodos,
      }
    }

    default:
      return state
  }
}

// Helper function to create action objects
export const todoActions = {
  setCompletedTodos: (completedTodos: number[]): Action => ({
    type: ActionTypes.SetCompletedTodos,
    payload: completedTodos,
  }),
  addTodo: (todo: Todo): Action => ({
    type: ActionTypes.AddTodo,
    payload: todo,
  }),
  updateTodo: (todo: Partial<Todo> & { id: number }): Action => ({
    type: ActionTypes.UpdateTodo,
    payload: todo,
  }),
  deleteTodo: (todoId: number): Action => ({
    type: ActionTypes.DeleteTodo,
    payload: todoId,
  }),
  toggleTodo: (todoId: number): Action => ({
    type: ActionTypes.ToggleTodo,
    payload: todoId,
  }),
}
