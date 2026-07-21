import { Link } from "react-router-dom";

function Navbar({ setToken }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Hospital System
        </Link>

        <div className="navbar-nav">
  <Link className="nav-link" to="/">
    Dashboard
  </Link>

  <Link className="nav-link" to="/doctors">
    Doctors
  </Link>

  <Link className="nav-link" to="/patients">
    Patients
  </Link>

  <Link className="nav-link" to="/departments">
    Departments
  </Link>

  <Link className="nav-link" to="/medicines">
    Medicines
  </Link>

  <Link className="nav-link" to="/appointments">
    Appointments
  </Link>

  <Link className="nav-link" to="/prescriptions">
    Prescriptions
  </Link>
</div>
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;