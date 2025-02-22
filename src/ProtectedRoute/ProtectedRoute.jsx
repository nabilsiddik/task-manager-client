import React, { useContext } from "react";
import { authContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useContext(authContext);

  if (loading) {
    return <h1 className="font-bold text-2xl text-center mt-20">Loading...</h1>
  }

  if (user?.email) {
    return children
  }

  return <Navigate to="/login" />
};

export default ProtectedRoute;
