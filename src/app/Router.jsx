import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Verify from "../pages/Verify";
import AccountAdded from "../pages/AccountAdd";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/accountadded" element={<AccountAdded />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
