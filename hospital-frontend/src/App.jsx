import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Departments from "./pages/Departments";
import Medicines from "./pages/Medicines";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Layout from "./components/Layout";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const ProtectedPage = (Component) =>
    token ? (
      <Layout setToken={setToken}>
        <Component />
      </Layout>
    ) : (
      <Navigate to="/" replace />
    );

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Root = Login مباشرة (لو مسجل دخول، وديه للـ Dashboard) */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={ProtectedPage(Dashboard)} />

        {/* Doctors */}
        <Route path="/doctors" element={ProtectedPage(Doctors)} />

        {/* Patients */}
        <Route path="/patients" element={ProtectedPage(Patients)} />

        {/* Departments */}
        <Route path="/departments" element={ProtectedPage(Departments)} />

        {/* Medicines */}
        <Route path="/medicines" element={ProtectedPage(Medicines)} />

        {/* Appointments */}
        <Route path="/appointments" element={ProtectedPage(Appointments)} />

        {/* Prescriptions */}
        <Route path="/prescriptions" element={ProtectedPage(Prescriptions)} />

        {/* Profile */}
        <Route path="/profile" element={ProtectedPage(Profile)} />

        {/* Settings */}
        <Route path="/settings" element={ProtectedPage(Settings)} />

        {/* Register */}
        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />

        {/* 404 → Root (Login) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;