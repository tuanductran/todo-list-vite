import cn from "clsx";
import type { FC } from "react";
import { memo } from "react";

import type { Todo } from "../schema";

const TodoItem: FC<{
  todo: Todo
  isCompleted: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}> = memo(
  ({ todo, isCompleted, onToggle, onEdit, onDelete }) => {
    const textClass = isCompleted
      ? "line-through text-gray-600 dark:text-gray-500"
      : "text-gray-900 dark:text-white";
    const togglebuttonClass = isCompleted
      ? "bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      : "bg-green-700 hover:bg-green-600 text-white dark:bg-green-500 dark:hover:bg-green-400";

    return (
      <div className="flex items-center rounded-lg bg-gray-100 px-4 py-3 shadow-sm transition-colors duration-300 dark:bg-gray-800">
        <p
          className={cn(
            "flex-1 text-sm truncate transition-colors duration-300",
            textClass,
          )}
        >
          {todo.text}
        </p>
        <button
          type="button"
          className={cn(
            "ml-4 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-300",
            togglebuttonClass,
          )}
          onClick={onToggle}
        >
          {isCompleted ? "Unmark" : "Complete"}
        </button>
        {!isCompleted && (
          <button
            type="button"
            className="ml-3 rounded-md bg-yellow-600 px-3 py-1 text-xs text-white font-semibold transition-colors duration-300 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="ml-3 rounded-md bg-red-700 px-3 py-1 text-xs text-white font-semibold transition-colors duration-300 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isCompleted === nextProps.isCompleted
    && prevProps.todo === nextProps.todo,
);

TodoItem.displayName = "TodoItem";

export default TodoItem;
