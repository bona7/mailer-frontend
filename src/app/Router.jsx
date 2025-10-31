import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignUp,
  SignIn,
  Verify,
  AccountAdded,
  MainPage,
  MailDetail,
} from "@/pages";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/accountadded" element={<AccountAdded />} />
        <Route path="/mail/:id" element={<MailDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
