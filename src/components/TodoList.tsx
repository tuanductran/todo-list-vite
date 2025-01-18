import clsx from "clsx";
import { FC, useMemo } from "react";
import type { TodoListProps } from "../schema";
import TodoItem from "./TodoItem";

const TodoList: FC<TodoListProps> = ({
  todos,
  error,
  completedTodos,
  handleDeleteClick,
  handleToggleClick,
}) => {
  // Memoize completedTodos set for efficient lookup (avoid recalculating on each render)
  const completedTodosSet = useMemo(() => new Set(completedTodos), [completedTodos]);

  // Render TodoItem components with efficient mapping
  const todoItems = useMemo(() => (
    todos.map((todo) => {
      const isCompleted = completedTodosSet.has(todo.id);
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          isCompleted={isCompleted}
          onToggle={() => handleToggleClick(todo.id)}
          onDelete={() => handleDeleteClick(todo.id)}
        />
      );
    })
  ), [todos, completedTodosSet, handleDeleteClick, handleToggleClick]);

  if (error) {
    return (
      <div className="py-4 text-center text-red-500 font-medium">
        Oops! Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div
      className={clsx("overflow-auto h-full", "max-h-screen")}
    >
      {todos.length ? todoItems : (
        <div className="py-4 text-center text-gray-500 font-medium">
          No tasks available. Add a new one to get started!
        </div>
      )}
    </div>
  );
};

export default TodoList;
