import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaUserCircle,
  FaBell,
  FaCog,
} from "react-icons/fa";

export default function DashboardTopbar({
  currentUser,
  notifications,
  darkMode,
  onToggleDarkMode,
  onExportPDF,
  onExportExcel,
  onPrint,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const unreadCount = notifications?.length || 0;

  return (
    <div
      className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 dashboard-topbar"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <h2 className="fw-bold mb-0">
        لوحة التحكم
      </h2>

      <div className="d-flex align-items-center flex-wrap gap-2">

        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
          onClick={onExportPDF}
        >
          <FaFilePdf /> Export PDF
        </button>

        <button
          className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
          onClick={onExportExcel}
        >
          <FaFileExcel /> Export Excel
        </button>

        <button
          className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1"
          onClick={onPrint}
        >
          <FaPrint /> Print
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onToggleDarkMode}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <Link
          to="/roles-permissions"
          className="btn btn-outline-primary btn-sm text-decoration-none d-flex align-items-center gap-1"
        >
          <FaShieldAlt />
          {currentUser?.role || "User"}
        </Link>

        {/* Notifications */}

        <div
          className="position-relative"
          ref={notificationsRef}
        >
          <button
            className="btn btn-outline-secondary btn-sm position-relative"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="dropdown-menu show shadow"
              style={{
                right: 0,
                left: "auto",
              }}
            >
              {notifications?.length ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="dropdown-item"
                  >
                    <div>{n.text}</div>

                    <small className="text-muted">
                      {n.time}
                    </small>
                  </div>
                ))
              ) : (
                <div className="dropdown-item text-muted">
                  لا توجد إشعارات
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}

        <div
          className="position-relative"
          ref={profileRef}
        >
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >
            <FaUserCircle size={18} />

            <span className="d-none d-md-inline">
              {currentUser?.name || "Admin"}
            </span>
          </button>

          {showProfile && (
            <div
              className="dropdown-menu show shadow"
              style={{
                right: 0,
                left: "auto",
              }}
            >
              <Link
                to="/profile"
                className="dropdown-item"
              >
                <FaUserCircle className="me-2" />
                الملف الشخصي
              </Link>

              <Link
                to="/settings"
                className="dropdown-item"
              >
                <FaCog className="me-2" />
                الإعدادات
              </Link>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}