import { Switch } from '@headlessui/react'
import { useEffect, useState, useCallback } from 'react'
import { openDB } from 'idb'

export default function DarkMode() {
  const [enabled, setEnabled] = useState(false)

  // Initialize or get IndexedDB
  const initDB = async () => {
    const db = await openDB('settings-db', 1, {
      upgrade(db) {
        db.createObjectStore('settings', { keyPath: 'key' })
      },
    })
    return db
  }

  // Save value to IndexedDB
  const setIDBValue = async (key: string, value: boolean | null) => {
    const db = await initDB()
    if (value === null) {
      await db.delete('settings', key)
    } else {
      await db.put('settings', { key, value })
    }
  }

  // Retrieve value from IndexedDB
  const getIDBValue = async (key: string): Promise<boolean | null> => {
    const db = await initDB()
    const result = await db.get('settings', key)
    return result ? result.value : null
  }

  // Update the dark mode class on <html>
  const updateDarkModeClass = useCallback((isDarkMode: boolean) => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  // Save setting to IndexedDB
  const handleIDB = useCallback(async (isDarkMode: boolean) => {
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    await setIDBValue('isDarkMode', isDarkMode === systemDarkMode ? null : isDarkMode)
  }, [])

  // Toggle dark mode
  const toggleMode = () => {
    setEnabled((prevEnabled) => {
      const newDarkMode = !prevEnabled
      updateDarkModeClass(newDarkMode)
      handleIDB(newDarkMode)
      return newDarkMode
    })
  }

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Load dark mode setting from IndexedDB or use system setting
    const loadInitialMode = async () => {
      const savedDarkMode = await getIDBValue('isDarkMode')
      const isSystemDarkMode = darkModeMediaQuery.matches
      const isDarkMode = savedDarkMode ?? isSystemDarkMode
      setEnabled(isDarkMode)
      updateDarkModeClass(isDarkMode)
    }

    loadInitialMode()

    const handleSystemChange = (e: MediaQueryListEvent) => {
      getIDBValue('isDarkMode').then((savedDarkMode) => {
        if (savedDarkMode === null) {
          setEnabled(e.matches)
          updateDarkModeClass(e.matches)
        }
      })
    }

    darkModeMediaQuery.addEventListener('change', handleSystemChange)
    return () => darkModeMediaQuery.removeEventListener('change', handleSystemChange)
  }, [updateDarkModeClass])

  return (
    <Switch
      checked={enabled}
      onChange={toggleMode}
      className="relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500 dark:focus:ring-offset-gray-800 dark:focus:ring-gray-400"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-5 rounded-full ${enabled ? 'bg-gray-800 translate-x-7' : 'bg-gray-200 translate-x-0'} ring-0 shadow-lg transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}
