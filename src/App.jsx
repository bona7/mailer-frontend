import Router from "./app/Router";
import "./App.css";

function App() {
  // The rest of the app can render immediately,
  // auth loading is handled by Clerk's components like <SignedIn>
  // or within hooks that need authentication.
  return <Router />;
}

export default App;
