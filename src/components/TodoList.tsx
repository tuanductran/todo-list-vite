import clsx from "clsx";
import type { FC } from "react";

import type { TodoListProps } from "../schema";
import TodoItem from "./TodoItem";

const TodoList: FC<TodoListProps> = ({
  todos,
  error,
  completedTodos,
  handleDeleteClick,
  handleToggleClick,
}) => {
  const completedTodosSet = new Set(completedTodos);

  if (error) {
    return (
      <div className="py-4 text-center text-red-500 font-medium">
        Oops! Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full max-h-screen">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isCompleted={completedTodosSet.has(todo.id)}
            onToggle={() => handleToggleClick(todo.id)}
            onDelete={() => handleDeleteClick(todo.id)}
          />
        ))
      ) : (
        <div className="py-4 text-center text-gray-500 font-medium">
          No tasks available. Add a new one to get started!
        </div>
      )}
    </div>
  );
};

export default TodoList;
