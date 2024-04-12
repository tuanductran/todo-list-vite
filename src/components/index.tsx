import useTodoActions from '../hooks/useTodoActions'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

export default function TodoPage() {
  const {
    todos,
    completedTodos,
    handleAddTodo,
    handleEditClick,
    handleDeleteClick,
    handleToggleClick
  } = useTodoActions()

  return (
    <div className="size-full flex items-center justify-center">
      <div className="bg-white rounded p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="block text-gray-800 text-base font-bold">Todo List</h1>
          <TodoForm onAddTodo={handleAddTodo} />
        </div>
        <TodoList
          todos={todos || []}
          completedTodos={completedTodos}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleToggleClick={handleToggleClick}
        />
      </div>
    </div>
  )
}
