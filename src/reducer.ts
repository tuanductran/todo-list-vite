import type { Action, State } from './type'

export function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COMPLETED_TODOS':
      return { ...state, completedTodos: action.payload }
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] }
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo,
        ),
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        completedTodos: state.completedTodos.includes(action.payload)
          ? state.completedTodos.filter(id => id !== action.payload)
          : [...state.completedTodos, action.payload],
      }
    default:
      return state
  }
}
