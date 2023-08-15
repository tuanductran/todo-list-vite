import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '../css/build.css'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root') ).render(
  <StrictMode>
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <App />
      </main>
      <Toaster toastOptions={{ position: 'top-center' }} />
    </div>
  </StrictMode>
)
