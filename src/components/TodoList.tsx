import cn from "clsx";
import type { FC } from "react";
import { useMemo } from "react";

import type { TodoListProps } from "../schema";

import TodoItem from "./TodoItem";

const TodoList: FC<TodoListProps> = ({
  todos,
  error,
  completedTodos,
  handleEditClick,
  handleDeleteClick,
  handleToggleClick,
}) => {
  // Use Set to optimize completedTodos lookups
  const completedTodosSet = useMemo(
    () => new Set(completedTodos),
    [completedTodos],
  );

  // Render the list of TodoItems
  const renderTodoItems = useMemo(
    () =>
      todos.map((todo) => {
        const isTodoCompleted = completedTodosSet.has(todo.id);
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isCompleted={isTodoCompleted}
            onToggle={() => handleToggleClick(todo.id)}
            onEdit={() => handleEditClick(todo.id)}
            onDelete={() => handleDeleteClick(todo.id)}
          />
        );
      }),
    [
      todos,
      completedTodosSet,
      handleEditClick,
      handleDeleteClick,
      handleToggleClick,
    ],
  );

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        An error occurred. Please try again later.
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-auto h-full", {
        "max-h-[300px]": todos.length > 4,
      })}
    >
      {renderTodoItems.length > 0
        ? (
            renderTodoItems
          )
        : (
            <div className="py-4 text-center text-gray-500">
              No todos available. Start by adding a new one!
            </div>
          )}
    </div>
  );
};

export default TodoList;
