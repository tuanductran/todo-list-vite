import { Toaster } from 'react-hot-toast'
import TodoPage from './components'

export default function App() {
  return (
    <div className="size-full flex content-center justify-center mt-8">
      <Toaster toastOptions={{ position: 'top-center' }} />
      <TodoPage />
    </div>
  )
}
