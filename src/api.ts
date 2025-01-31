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
  const db = await initializeDB();
  return db.getAll("todos");
}

export async function addTodo(todo: Todo): Promise<void> {
  const db = await initializeDB();
  await db.put("todos", todo);
}

export async function updateTodo(updatedTodo: Todo): Promise<void> {
  const db = await initializeDB();
  await db.put("todos", updatedTodo);
}

export async function deleteTodo(todoId: string): Promise<void> {
  const db = await initializeDB();
  await db.delete("todos", todoId);
}

export async function getCompletedTodos(): Promise<string[]> {
  const todos = await getTodos();
  return todos.filter((todo) => todo.completed).map((todo) => todo.id);
}

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
  } catch (error) {
    console.error("Failed to save completed todos:", error);
  }
}

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getCompletedTodos,
  saveCompletedTodos,
};
