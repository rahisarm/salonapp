import { Login } from "@/pages/auth/login";
import { Dashboard } from "@/pages/dashboard";
import { UserMaster } from "@/pages/masters/UserMaster";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRoutes: React.FC=()=>{
    return (
        <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/dashboard' element={<Dashboard></Dashboard>}>
                <Route path="usermaster" element={<UserMaster></UserMaster>}></Route>
            </Route>
            
            <Route path='/' element={<Navigate to="/login"></Navigate>}></Route>
        </Routes>
    )
}

export default AppRoutes;
