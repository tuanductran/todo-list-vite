import useTodoActions from "../hooks/useTodoActions";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function TodoPage() {
  const {
    todos,
    error,
    completedTodos,
    handleAddTodo,
    handleDeleteClick,
    handleToggleClick,
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
          {!error && <TodoForm onAddTodo={handleAddTodo} />}
        </div>
        <TodoList
          todos={todos || []}
          error={error}
          completedTodos={completedTodos}
          handleDeleteClick={handleDeleteClick}
          handleToggleClick={handleToggleClick}
        />
      </div>
    </div>
  );
}
