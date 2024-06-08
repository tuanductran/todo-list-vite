import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'

export default function DarkMode() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isSystemDarkMode = darkModeMediaQuery.matches
    const savedDarkMode = window.localStorage.getItem('isDarkMode')

    const isDarkMode =
      savedDarkMode === 'true' || (savedDarkMode === null && isSystemDarkMode)

    setEnabled(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (savedDarkMode === null) {
        document.documentElement.classList.toggle('dark', e.matches)
        setEnabled(e.matches)
      }
    }

    darkModeMediaQuery.addEventListener('change', handleSystemChange)
    return () =>
      darkModeMediaQuery.removeEventListener('change', handleSystemChange)
  }, [])

  function toggleMode() {
    const isDarkMode = !enabled
    setEnabled(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)

    if (
      isDarkMode === window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      window.localStorage.removeItem('isDarkMode')
    } else {
      window.localStorage.setItem('isDarkMode', isDarkMode.toString())
    }
  }

  return (
    <Switch
      checked={enabled}
      onChange={toggleMode}
      className="relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500 dark:focus:ring-offset-gray-800 dark:focus:ring-gray-400"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 rounded-full bg-gray-800 dark:bg-gray-200 ring-0 shadow-lg transition duration-200 ease-in-out translate-x-0 dark:translate-x-7"
      />
    </Switch>
  )
}
