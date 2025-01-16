import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

import type { Todo } from "./schema";

// Define the TodoDB schema interface
interface TodoDB extends DBSchema {
  todos: {
    key: string; 
    value: Todo;
    indexes: {
      "by-completed": boolean;
    };
  };
}

let dbInstance: Promise<IDBDatabase> | null = null;

async function initializeDB(): Promise<IDBDatabase> {
  if (!dbInstance) {
    dbInstance = openDB("todosDB", {
      version: 1,
      upgrade(db: IDBDatabase) {
        if (!db.objectStoreNames.contains("todos")) {
          const store = db.createObjectStore("todos", { keyPath: "id" });
          store.createIndex("by-completed", "completed");
        }
      },
    });
  }
  return dbInstance;
}

export async function getTodos(): Promise<Todo[]> {
  const db = await initializeDB();
  const tx = db.transaction("todos", "readonly");
  const store = tx.objectStore("todos");
  return store.getAll();
}

export async function addTodo(todo: Todo): Promise<void> {
  const db = await initializeDB();
  const tx = db.transaction("todos", "readwrite");
  await tx.objectStore("todos").add(todo);
  await tx.done;
}

export async function updateTodo(todo: Todo): Promise<void> {
  const db = await initializeDB();
  const tx = db.transaction("todos", "readwrite");
  await tx.objectStore("todos").put(todo);
  await tx.done;
}

export async function deleteTodo(id: string): Promise<void> {
  const db = await initializeDB();
  const tx = db.transaction("todos", "readwrite");
  await tx.objectStore("todos").delete(id);
  await tx.done;
}

export async function getCompletedTodos(): Promise<string[]> {
  const db = await initializeDB();
  const tx = db.transaction("todos", "readonly");
  const store = tx.objectStore("todos");
  const index = store.index("by-completed");
  const completedTodos = await index.getAll(IDBKeyRange.only(true));
  return completedTodos.map((todo) => todo.id);
}

export async function saveCompletedTodos(completedIds: string[]): Promise<void> {
  const db = await initializeDB();
  const tx = db.transaction("todos", "readwrite");
  const store = tx.objectStore("todos");

  try {
    await Promise.all(
      completedIds.map(async (id) => {
        const todo = await store.get(id);
        if (todo && !todo.completed) {
          todo.completed = true;
          await store.put(todo);
        }
      })
    );
    await tx.done;
  } catch (error) {
    console.error("Failed to save completed todos:", error);
    throw error;
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
