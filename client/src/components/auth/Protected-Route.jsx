import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false); // Update loading state
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally render a loading state
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
