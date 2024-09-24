import { Login } from "@/pages/auth/login";
import { Dashboard } from "@/pages/dashboard";
import { UserMaster } from "@/pages/masters/UserMaster";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes: React.FC=()=>{
    return (
        <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard></Dashboard>}></ProtectedRoute>}>
                <Route path="usermaster" element={<ProtectedRoute element={<UserMaster></UserMaster>}></ProtectedRoute>}></Route>
            </Route>
            
            <Route path='/' element={<Navigate to="/login"></Navigate>}></Route>
        </Routes>
    )
}

export default AppRoutes;
