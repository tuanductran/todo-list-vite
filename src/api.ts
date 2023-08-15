interface Todo {
  id: number
  text: string
}

/* `let todos: Todo[] = []` is declaring a variable named `todos` with the type `Todo[]`, which represents an array of `Todo`
objects. This variable is used to store and manipulate a list of todos. */
let todos: Todo[] = []

/**
 * The `delay` function returns a promise that resolves after a delay of 800 milliseconds.
 */
const delay = () => new Promise<void>((res) => setTimeout(() => res(), 800))

/**
 * The function `getTodos` returns a promise that resolves to an array of `Todo` objects after a delay.
 * @returns a Promise that resolves to an array of Todo objects.
 */
export async function getTodos(): Promise<Todo[]> {
  await delay()
  return todos
}

/**
 * The function adds a new todo item to an array of todos and returns the updated array, with a possibility of throwing an
 * error.
 * @param {Todo} todo - The `todo` parameter is of type `Todo`, which represents a single todo item.
 * @returns a Promise that resolves to an array of Todo objects.
 */
export async function addTodo(todo: Todo): Promise<Todo[]> {
  await delay()
  if (Math.random() < 0.5) throw new Error('Failed to add new item!')
  todos = [...todos, todo]
  return todos
}
