import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CContainer } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Login from "./containers/login";
import Register from "./containers/register";
// import Dashboard from "./containers/Dashboard";

function App() {
  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<Dashboard />} /> 
          </Route> */}
        </Routes>
      </div>
    </div>
  );
}

export default App
