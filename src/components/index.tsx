import useTodoActions from '../hooks/useTodoActions'
import DarkMode from './DarkMode'
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 m-4 w-full lg:w-3/4 lg:max-w-xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Todo List
            </h1>
            <DarkMode />
          </div>
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
