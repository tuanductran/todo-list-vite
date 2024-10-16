import type { Action, State } from './schema'

const ADD_TODO = 'ADD_TODO'
const DELETE_TODO = 'DELETE_TODO'
const SET_COMPLETED_TODOS = 'SET_COMPLETED_TODOS'
const TOGGLE_TODO = 'TOGGLE_TODO'
const UPDATE_TODO = 'UPDATE_TODO'

export function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      }
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      }

    case SET_COMPLETED_TODOS:
      return {
        ...state,
        completedTodos: action.payload,
      }

    case TOGGLE_TODO:
      return {
        ...state,
        completedTodos: state.completedTodos.includes(action.payload)
          ? state.completedTodos.filter(id => id !== action.payload)
          : [...state.completedTodos, action.payload],
      }

    case UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo,
        ),
      }

    default:
      return state
  }
}
