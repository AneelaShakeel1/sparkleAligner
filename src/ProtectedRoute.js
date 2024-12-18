import { Spin } from "antd";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ component: Component, isPublic, ...rest }) => {
  // debugger;
  const isAuthenticated = localStorage.getItem("token") !== null;
  const location = useLocation();
  // if (isPublic && isAuthenticated) {
  // es line m masala hai hmari location set ni ho rhi , khair abi k liye naviagte wla km kr dia h esy krein agy apna km esy esa rehn dain abi
  //   return <Navigate to="/" state={{ from: location }} />;
  // }
  // if (!isPublic && !isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} />;
  // }
  return isAuthenticated || isPublic ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
