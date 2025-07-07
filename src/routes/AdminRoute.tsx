import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { TokenStorage } from "../utils/tokenStorage";

interface Props {
  children: JSX.Element;
}

function AdminRoute({ children }: Props): JSX.Element {
  const role = TokenStorage.getUserRole();
  if (role !== "ADMIN") {
    return <Navigate to="/news" replace />;
  }
  return children;
}

export default AdminRoute;
