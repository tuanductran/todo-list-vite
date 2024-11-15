import { Switch } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";

export default function DarkMode() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const savedDarkMode = window.localStorage.getItem("isDarkMode");
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return savedDarkMode === "true" || (savedDarkMode === null && systemDarkMode);
  });

  const updateDarkModeClass = useCallback((isDarkMode: boolean) => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const handleLocalStorage = useCallback((isDarkMode: boolean) => {
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDarkMode === systemDarkMode) {
      window.localStorage.removeItem("isDarkMode");
    }
    else {
      window.localStorage.setItem("isDarkMode", isDarkMode.toString());
    }
  }, []);

  const toggleMode = () => {
    const newDarkMode = !enabled;
    setEnabled(newDarkMode);
    updateDarkModeClass(newDarkMode);
    handleLocalStorage(newDarkMode);
  };

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      const savedDarkMode = window.localStorage.getItem("isDarkMode");
      if (savedDarkMode === null) {
        const systemDarkMode = e.matches;
        setEnabled(systemDarkMode);
        updateDarkModeClass(systemDarkMode);
      }
    };

    darkModeMediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [updateDarkModeClass]);

  useEffect(() => {
    updateDarkModeClass(enabled);
  }, [enabled, updateDarkModeClass]);

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
  );
}
