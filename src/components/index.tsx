import { useTodoActions } from "../hooks/useTodoActions";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function TodoPage() {
  const {
    todos,
    error,
    addNewTodo,
    toggleTodo,
    removeTodo,
  } = useTodoActions();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="m-4 w-full rounded-lg bg-white p-8 shadow-lg transition-colors duration-300 lg:max-w-xl lg:w-3/4 dark:bg-gray-900">
        <div className="mb-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-6">
              Manage your tasks
            </h3>
          </div>
          {!error && <TodoForm onAddTodo={addNewTodo} />}
        </div>
        <TodoList
          todos={todos}
          error={error}
          removeTodo={removeTodo}
          toggleTodo={toggleTodo}
        />
      </div>
    </div>
  );
}
