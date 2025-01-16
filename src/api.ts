import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

import type { Todo } from "./schema";

// Define the TodoDB schema interface
interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
  };
}

// Hold the DB instance for reuse
let dbInstance: Promise<IDBPDatabase<TodoDB>> | null = null;

// Initialize the database if it hasn't been opened yet
async function initializeDB(): Promise<IDBPDatabase<TodoDB>> {
  if (!dbInstance) {
    dbInstance = openDB<TodoDB>("todosDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("todos")) {
          db.createObjectStore("todos", { keyPath: "id" });
        }
      },
    });
  }
  return dbInstance;
}

// Fetch all todos from the database
export async function getTodos(): Promise<Todo[]> {
  const db = await initializeDB();
  return db.getAll("todos");
}

// Add a new todo to the database
export async function addTodo(todo: Todo): Promise<void> {
  const db = await initializeDB();
  await db.put("todos", todo);
}

// Update an existing todo in the database
export async function updateTodo(updatedTodo: Todo): Promise<void> {
  const db = await initializeDB();
  await db.put("todos", updatedTodo);
}

// Delete a todo by ID from the database
export async function deleteTodo(todoId: string): Promise<void> {
  const db = await initializeDB();
  await db.delete("todos", todoId);
}

// Get a list of completed todo IDs
export async function getCompletedTodos(): Promise<string[]> {
  const todos = await getTodos();
  return todos.filter((todo) => todo.completed).map((todo) => todo.id);
}

// Save completed todo statuses by updating their 'completed' field
export async function saveCompletedTodos(completedTodos: string[]): Promise<void> {
  try {
    const db = await initializeDB();
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");

    const updatePromises = completedTodos.map(async (id) => {
      const todo = await store.get(id);
      if (todo && !todo.completed) {
        todo.completed = true;
        await store.put(todo);
      }
    });

    await Promise.all(updatePromises);
    await tx.done;
  } catch (error: any) {
    console.error("Failed to save completed todos:", error);
  }
}

// Export all functions
export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getCompletedTodos,
  saveCompletedTodos,
};
