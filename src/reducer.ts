import type { Action, State } from './type'
import {
  SET_COMPLETED_TODOS,
  ADD_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  TOGGLE_TODO
} from './constants'

export function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case SET_COMPLETED_TODOS:
      if (state.completedTodos === action.payload) {
        return state
      }
      return { ...state, completedTodos: action.payload }

    case ADD_TODO:
      if (state.todos.includes(action.payload)) {
        return state
      }
      return { ...state, todos: [...state.todos, action.payload] }

    case UPDATE_TODO:
      const updatedTodos = state.todos.map(todo =>
        todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
      )
      if (updatedTodos === state.todos) {
        return state
      }
      return { ...state, todos: updatedTodos }

    case DELETE_TODO:
      const remainingTodos = state.todos.filter(({ id }) => id !== action.payload)
      if (remainingTodos.length === state.todos.length) {
        return state
      }
      return { ...state, todos: remainingTodos }

    case TOGGLE_TODO: {
      const { completedTodos } = state
      const isCompleted = completedTodos.includes(action.payload)
      const updatedCompletedTodos = isCompleted
        ? completedTodos.filter(id => id !== action.payload)
        : [...completedTodos, action.payload]

      if (updatedCompletedTodos === completedTodos) {
        return state
      }
      return {
        ...state,
        completedTodos: updatedCompletedTodos,
      }
    }

    default:
      return state
  }
}
