import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { Todo } from "./schema";

interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
  };
}

let dbInstance: Promise<IDBPDatabase<TodoDB>> | null = null;

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

export async function getTodos(): Promise<Todo[]> {
  try {
    const db = await initializeDB();
    return await db.getAll("todos");
  } catch (error) {
    console.error("Error fetching todos from IndexedDB:", error);
    return [];
  }
}

export async function addTodo(todo: Todo): Promise<void> {
  try {
    const db = await initializeDB();
    await db.put("todos", todo);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

export async function updateTodo(updatedTodo: Todo): Promise<void> {
  try {
    const db = await initializeDB();
    await db.put("todos", updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

export async function deleteTodo(todoId: string): Promise<void> {
  try {
    const db = await initializeDB();
    await db.delete("todos", todoId);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
