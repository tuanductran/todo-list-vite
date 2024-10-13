import type { Action, State } from './type'

const SET_COMPLETED_TODOS = 'SET_COMPLETED_TODOS'
const ADD_TODO = 'ADD_TODO'
const UPDATE_TODO = 'UPDATE_TODO'
const DELETE_TODO = 'DELETE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

export function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case SET_COMPLETED_TODOS:
      return { ...state, completedTodos: action.payload }

    case ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] }

    case UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        ),
      }

    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(({ id }) => id !== action.payload),
      }

    case TOGGLE_TODO:
      const { completedTodos } = state;
      const isCompleted = completedTodos.includes(action.payload);
      return {
        ...state,
        completedTodos: isCompleted
          ? completedTodos.filter(id => id !== action.payload)
          : [...completedTodos, action.payload],
      }

    default:
      return state
  }
}
