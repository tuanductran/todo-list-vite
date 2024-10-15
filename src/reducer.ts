import type { Action, State } from './schema'

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      }
<<<<<<< Updated upstream
    case 'TOGGLE_TODO':
=======

    case SET_COMPLETED_TODOS:
      return {
        ...state,
        completedTodos: action.payload,
      }

    case TOGGLE_TODO: {
      const { completedTodos } = state
      const isCompleted = completedTodos.includes(action.payload)
>>>>>>> Stashed changes
      return {
        ...state,
        completedTodos: state.completedTodos.includes(action.payload)
          ? state.completedTodos.filter(id => id !== action.payload)
          : [...state.completedTodos, action.payload],
      }
<<<<<<< Updated upstream
=======
    }

    case UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo,
        ),
      }

>>>>>>> Stashed changes
    default:
      return state
  }
}
