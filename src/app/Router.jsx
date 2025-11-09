import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  SignUp,
  SignIn,
  Verify,
  AccountAdded,
  MainPage,
  MailDetail,
  Trash,
  ViewTemplate,
  MyTemplate,
} from "@/pages";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accountadded"
          element={
            <ProtectedRoute>
              <AccountAdded />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/:id"
          element={
            <ProtectedRoute>
              <MailDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewtemplate"
          element={
            <ProtectedRoute>
              <ViewTemplate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mytemplate"
          element={
            <ProtectedRoute>
              <MyTemplate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
