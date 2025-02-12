import { Toaster } from "sonner";

import TodoPage from "./components";
import { TodoProvider } from "./context";

export default function App() {
  return (
    <TodoProvider>
      <Toaster position="top-center" richColors />
      <TodoPage />
    </TodoProvider>
  );
}
