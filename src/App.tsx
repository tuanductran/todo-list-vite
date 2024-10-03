import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Toaster } from 'react-hot-toast'

import TodoPage from './components'

export default function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Toaster toastOptions={{ position: 'top-right', className: 'toast' }} />
      <TodoPage />
    </>
  )
}
