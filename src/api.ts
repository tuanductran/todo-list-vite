import type { Todo } from "./schema";

const API_URL = `${import.meta.env.VITE_API_URL}/api/todos`;

export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Failed to fetch todos: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching todos from Cloudflare Worker:", error);
    return [];
  }
}

export async function addTodo(todo: Todo): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error(`Failed to add todo: ${response.statusText}`);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

export async function updateTodo(updatedTodo: Todo): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${updatedTodo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });
    if (!response.ok) throw new Error(`Failed to update todo: ${response.statusText}`);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

export async function deleteTodo(todoId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${todoId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Failed to delete todo: ${response.statusText}`);
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
