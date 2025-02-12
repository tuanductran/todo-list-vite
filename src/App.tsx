import { Toaster } from "sonner";

import TodoPage from "./components";

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <TodoPage />
    </>
  );
}
