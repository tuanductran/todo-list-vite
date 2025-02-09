import clsx from "clsx";
import type { Todo } from "../schema";

interface TodoItemProps {
  todo: Todo;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function TodoItem({ todo, isCompleted, onToggle, onDelete }: TodoItemProps) {
  const textClass = clsx(
    "flex-1 text-sm truncate transition-colors duration-300",
    isCompleted
      ? "line-through text-gray-600 dark:text-gray-500"
      : "text-gray-900 dark:text-white"
  );

  const toggleButtonClass = clsx(
    "ml-4 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-300",
    isCompleted
      ? "bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      : "bg-green-700 hover:bg-green-600 text-white dark:bg-green-500 dark:hover:bg-green-400"
  );

  return (
    <div className="flex items-center py-3">
      <p className={textClass}>{todo.text}</p>
      <button type="button" className={toggleButtonClass} onClick={onToggle}>
        {isCompleted ? "Unmark" : "Complete"}
      </button>
      <button
        type="button"
        className="ml-3 rounded-md bg-red-700 px-3 py-1 text-xs text-white font-semibold transition-colors duration-300 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
