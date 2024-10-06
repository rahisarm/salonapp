import { Login } from "@/pages/auth/login";
import { Dashboard } from "@/pages/dashboard";
import { UserMaster } from "@/pages/masters/UserMaster";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ClientMaster } from "@/pages/masters/ClientMaster";
import { EmployeeMaster } from "@/pages/masters/EmployeeMaster";
import { AccountMaster } from "@/pages/masters/AccountMaster";
import { ProductMaster } from "@/pages/masters/ProductMaster";
import { ComboMaster } from "@/pages/masters/ComboMaster";
import { Expense } from "@/pages/transactions/Expense";
import { VendorMaster } from "@/pages/masters/VendorMaster";

const AppRoutes: React.FC=()=>{
    return (
        <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard></Dashboard>}></ProtectedRoute>}>
                <Route path="usermaster" element={<ProtectedRoute element={<UserMaster></UserMaster>}></ProtectedRoute>}></Route>
                <Route path="clientmaster" element={<ProtectedRoute element={<ClientMaster></ClientMaster>}></ProtectedRoute>}></Route>
                <Route path="employeemaster" element={<ProtectedRoute element={<EmployeeMaster></EmployeeMaster>}></ProtectedRoute>}></Route>
                <Route path="accountmaster" element={<ProtectedRoute element={<AccountMaster></AccountMaster>}></ProtectedRoute>}></Route>
                <Route path="productmaster" element={<ProtectedRoute element={<ProductMaster></ProductMaster>}></ProtectedRoute>}></Route>
                <Route path="combomaster" element={<ProtectedRoute element={<ComboMaster></ComboMaster>}></ProtectedRoute>}></Route>
                <Route path="vendormaster" element={<ProtectedRoute element={<VendorMaster></VendorMaster>}></ProtectedRoute>}></Route>
                <Route path="expense" element={<ProtectedRoute element={<Expense></Expense>}></ProtectedRoute>}></Route>
            </Route>
            
            <Route path='/' element={<Navigate to="/login"></Navigate>}></Route>
        </Routes>
    )
}

export default AppRoutes;
