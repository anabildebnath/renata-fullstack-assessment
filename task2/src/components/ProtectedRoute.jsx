import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Ensure the user is authenticated
  if (!user) {
    console.warn("User is not authenticated. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected content if authenticated
}
