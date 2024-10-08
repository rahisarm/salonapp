import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps{
    element:React.ReactNode
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const isAuthenticated=!!localStorage.getItem('token');
    return isAuthenticated?element:<Navigate to={'/'}/>;
}
export default ProtectedRoute;