// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isLoading, loadUserFromToken } = useAuthStore();
  const location = useLocation();

  // On first mount, try loading user from token
  useEffect(() => {
    if (!user && token) {
      loadUserFromToken();
    }
  }, [user, token, loadUserFromToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-pulse text-lg font-medium text-dark">
          Loading...
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
