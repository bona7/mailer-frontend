import Router from "./app/Router";
import "./App.css";
import { ToastProvider } from "@/components/ui/SendToastProvider";
import { AISummaryProvider } from "./context/AISummaryContext";

function App() {
  return (
    <ToastProvider>
      <AISummaryProvider>
        <Router />
      </AISummaryProvider>
    </ToastProvider>
  );
}

export default App;
