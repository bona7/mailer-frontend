import Router from "./app/Router";
import "./App.css";
import { ToastProvider } from "@/components/ui/SendToastProvider";

function App() {
  return (
    <ToastProvider>
      <Router />
    </ToastProvider>
  );
}

export default App;
