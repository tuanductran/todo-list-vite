import { useMemo } from "react";
import clsx from "clsx";
import type { TodoListProps } from "../schema";
import TodoItem from "./TodoItem";

const TodoList = ({
  todos,
  error,
  completedTodos,
  handleDeleteClick,
  handleToggleClick,
}: TodoListProps) => {
  const completedTodosSet = useMemo(
    () => new Set(completedTodos),
    [completedTodos]
  );

  const content = useMemo(() => {
    if (error) {
      return (
        <div className="py-4 text-center text-red-500 font-medium">
          Oops! Something went wrong. Please try again later.
        </div>
      );
    }

    if (!todos.length) {
      return (
        <div className="py-4 text-center text-gray-500 font-medium">
          No tasks available. Add a new one to get started!
        </div>
      );
    }

    return todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isCompleted={completedTodosSet.has(todo.id)}
        onToggle={() => handleToggleClick(todo.id)}
        onDelete={() => handleDeleteClick(todo.id)}
      />
    ));
  }, [todos, error, completedTodosSet, handleToggleClick, handleDeleteClick]);

  return (
    <div className={clsx("overflow-auto h-full", "max-h-screen")}>
      {content}
    </div>
  );
};

export default TodoList;
