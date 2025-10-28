import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignUp,
  SignIn,
  Verify,
  AccountAdded,
  TestPage,
  ViewTemplate,
  MyTemplate,
} from "@/pages";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/accountadded" element={<AccountAdded />} />
        <Route path="/viewtemplate" element={<ViewTemplate />} />
        <Route path="/mytemplate" element={<MyTemplate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
