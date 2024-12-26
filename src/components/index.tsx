import useTodoActions from "../hooks/useTodoActions";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function TodoPage() {
  const {
    todos,
    error,
    completedTodos,
    handleAddTodo,
    handleEditClick,
    handleDeleteClick,
    handleToggleClick,
  } = useTodoActions();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
      <div className="m-4 w-full rounded-lg bg-white p-8 shadow-lg transition-colors duration-300 lg:max-w-xl lg:w-3/4 dark:bg-gray-800">
        <div className="mb-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl text-gray-900 font-bold dark:text-gray-100">
              Todo List
            </h1>
          </div>
          {error
            ? (
                <div className="text-center text-red-500">Error loading todos.</div>
              )
            : (
                <TodoForm onAddTodo={handleAddTodo} />
              )}
        </div>
        <TodoList
          todos={todos || []}
          error={error}
          completedTodos={completedTodos}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleToggleClick={handleToggleClick}
        />
      </div>
    </div>
  );
}
