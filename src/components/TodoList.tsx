import type { TodoListProps } from "../schema";

import TodoItem from "./TodoItem";

function TodoList({
  todos,
  error,
  toggleTodo,
  removeTodo,
}: TodoListProps) {
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
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => removeTodo(todo.id)}
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
