import React, { JSX } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/pages/LoginPage";
import SignupPage from "./views/pages/SignupPage";
import SavedArticlesPage from "./views/pages/SavedArticlesPage";
import NotificationsPage from "./views/pages/NotificationsPage";
import FeedbackPage from "./views/pages/FeedbackPage";
import ProfilePage from "./views/pages/ProfilePage";
import SearchPage from "./views/pages/SearchPage";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import HeadlinesPage from "./views/pages/HeadlinesPage";
import AdminServersPage from "./views/pages/AdminServersPage";
import AdminUsersPage from "./views/pages/AdminUsersPage";
import AdminReportsPage from "./views/pages/AdminReportsPage";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <HeadlinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/servers"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminServersPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminReportsPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
