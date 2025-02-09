import { Toaster } from "sonner";

import TodoPage from "./components";

export default function App() {
  return (
    <>
      <Toaster position="bottom-left" richColors />
      <TodoPage />
    </>
  );
}
