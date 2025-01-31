import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { Todo } from "./schema";

interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
  };
}

let dbInstancePromise!: Promise<IDBPDatabase<TodoDB>>;

function initializeDB(): Promise<IDBPDatabase<TodoDB>> {
  if (!dbInstancePromise) {
    dbInstancePromise = openDB<TodoDB>("todosDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("todos")) {
          db.createObjectStore("todos", { keyPath: "id" });
        }
      },
    });
  }
  return dbInstancePromise;
}

async function safeExecute<T>(operationName: string, operationFn: () => Promise<T>): Promise<T> {
  try {
    return await operationFn();
  } catch (error) {
    console.error(`Error during ${operationName}:`, error);
    throw new Error(`Failed to ${operationName}`);
  }
}

export async function getTodos(): Promise<Todo[]> {
  return safeExecute("getTodos", async () => {
    const db = await initializeDB();
    return db.getAll("todos");
  });
}

export async function addTodo(todo: Todo): Promise<void> {
  return safeExecute("addTodo", async () => {
    const db = await initializeDB();
    await db.put("todos", todo);
  });
}

export async function updateTodo(updatedTodo: Todo): Promise<void> {
  return safeExecute("updateTodo", async () => {
    const db = await initializeDB();
    await db.put("todos", updatedTodo);
  });
}

export async function deleteTodo(todoId: string): Promise<void> {
  return safeExecute("deleteTodo", async () => {
    const db = await initializeDB();
    await db.delete("todos", todoId);
  });
}
