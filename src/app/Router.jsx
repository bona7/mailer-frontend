import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  SignUp,
  SignIn,
  Verify,
  MainVerify,
  AccountAddedSuccess,
  MainPage,
  MailDetail,
  Trash,
  ViewTemplate,
  MyTemplate,
  AddAccountPage,
  AccountListPage,
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
        <Route path="/mainverify" element={<MainVerify />} />
        <Route
          path="/accountadded"
          element={
            <ProtectedRoute>
              <AccountAddedSuccess /> {/* Changed from AccountAdded */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-account"
          element={
            <ProtectedRoute>
              <AddAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <AccountListPage />
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
