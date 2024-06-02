import { Toaster } from 'react-hot-toast'
import TodoPage from './components'

export default function App() {
  return (
    <div>
      <Toaster toastOptions={{ position: 'top-center' }} />
      <TodoPage />
    </div>
  )
}
