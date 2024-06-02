import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'

export default function DarkMode() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isSystemDarkMode = darkModeMediaQuery.matches
    const isDarkMode =
      window.localStorage.isDarkMode === 'true' ||
      (window.localStorage.isDarkMode === undefined && isSystemDarkMode)

    setEnabled(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  function toggleMode() {
    const isDarkMode = !enabled
    setEnabled(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)

    if (
      isDarkMode === window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      delete window.localStorage.isDarkMode
    } else {
      window.localStorage.isDarkMode = isDarkMode
    }
  }

  return (
    <Switch
      checked={enabled}
      onChange={toggleMode}
      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500 dark:focus:ring-offset-gray-800 dark:focus:ring-gray-400"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-gray-800 dark:bg-gray-200 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
      />
    </Switch>
  )
}
