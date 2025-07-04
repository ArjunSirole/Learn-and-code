import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TokenStorage } from "../utils/tokenStorage";

interface Props {
  children: JSX.Element;
}

function ProtectedRoute({ children }: Props): JSX.Element {
  const token = TokenStorage.getToken();
  const role = TokenStorage.getUserRole();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (
    role === "ADMIN" &&
    !location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/admin/servers" replace />;
  }

  return children;
}

export default ProtectedRoute;
