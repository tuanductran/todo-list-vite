import { Toaster } from "react-hot-toast"
import Todo from "./components"

export default function App() {
  return (
    <div className="w-full h-full flex content-center justify-center mt-8">
      <Toaster toastOptions={{ position: 'top-left' }} />
      <Todo />
    </div>
  )
}
