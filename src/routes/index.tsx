import DashboardLayout from "@/layouts/dashboardLayout";
import { Login } from "@/pages/auth/login";
import { Dashboard } from "@/pages/dashboard";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRoutes: React.FC=()=>{
    return (
        <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
            <Route path='/' element={<Navigate to="/login"></Navigate>}></Route>
        </Routes>
    )
}

export default AppRoutes;
