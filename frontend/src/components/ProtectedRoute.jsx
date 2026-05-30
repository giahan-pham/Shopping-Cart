import { Navigate } from "react-router-dom";

import { isLoggedIn, isAdmin } from "../api/authApi";

function ProtectedRoute({ children, requiredRole }) {
  // User not logged in
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace />;
  }

  // Route requires admin role
  if (requiredRole === "admin" && !isAdmin()) {
    return <Navigate to="/records" replace />;
  }

  // Access allowed
  return children;
}

export default ProtectedRoute;