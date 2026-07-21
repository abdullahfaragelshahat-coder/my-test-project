// File: hospital-frontend/src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ setToken }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/", { replace: true });
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: "270px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      <div className="text-center py-4 border-bottom">
        <h3>🏥 Hospital</h3>
        <small className="text-secondary">
          Management System
        </small>
      </div>

      <div className="flex-grow-1 p-3">

        <NavLink
          to="/dashboard"
          className="nav-link text-white mb-2 rounded p-3"
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/doctors"
          className="nav-link text-white mb-2 rounded p-3"
        >
          👨‍⚕️ Doctors
        </NavLink>

        <NavLink
          to="/patients"
          className="nav-link text-white mb-2 rounded p-3"
        >
          🧑 Patients
        </NavLink>

        <NavLink
          to="/departments"
          className="nav-link text-white mb-2 rounded p-3"
        >
          🏢 Departments
        </NavLink>

        <NavLink
          to="/medicines"
          className="nav-link text-white mb-2 rounded p-3"
        >
          💊 Medicines
        </NavLink>

        <NavLink
          to="/appointments"
          className="nav-link text-white mb-2 rounded p-3"
        >
          📅 Appointments
        </NavLink>

        <NavLink
          to="/prescriptions"
          className="nav-link text-white mb-2 rounded p-3"
        >
          📄 Prescriptions
        </NavLink>

      </div>

      <div className="p-3 border-top">

        <button
          className="btn btn-danger w-100"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;