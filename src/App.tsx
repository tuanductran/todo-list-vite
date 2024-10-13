import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Toaster } from 'sonner'

import TodoPage from './components'

export default function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Toaster position="top-center" richColors />
      <TodoPage />
    </>
  )
}
