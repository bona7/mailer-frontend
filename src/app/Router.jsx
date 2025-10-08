import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp, SignIn, Verify, AccountAdded, TestPage } from "@/pages";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/accountadded" element={<AccountAdded />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
