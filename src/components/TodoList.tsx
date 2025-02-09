import TodoItem from "./TodoItem";

import type { TodoListProps } from "../schema";

function TodoList({
  todos,
  error,
  completedTodos,
  handleDeleteClick,
  handleToggleClick,
}: TodoListProps) {
  const completedTodosSet = new Set(completedTodos);

  if (error) {
    return (
      <div className="py-4 text-center text-red-500 font-medium">
        Oops! Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="h-full max-h-screen overflow-auto">
      {todos.length > 0
        ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isCompleted={completedTodosSet.has(todo.id)}
                onToggle={() => handleToggleClick(todo.id)}
                onDelete={() => handleDeleteClick(todo.id)}
              />
            ))
          )
        : (
            <div className="py-4 text-center text-gray-500 font-medium">
              No tasks available. Add a new one to get started!
            </div>
          )}
    </div>
  );
}

export default TodoList;
