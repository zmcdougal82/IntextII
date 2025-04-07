import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // If still loading auth state, show nothing or a loading spinner
  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }
  
  // For admin routes, check if user is admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  // For regular protected routes, check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated (and admin if required), render the child routes
  return <Outlet />;
};

export default PrivateRoute;
