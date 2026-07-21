import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function StatsGrid({ stats }) {
  return (
    <div className="row g-4">
      {stats.map((item, index) => (
        <div className="col-xl-4 col-lg-6" key={index}>
          <div className={`card border-0 shadow-lg text-white dashboard-card ${item.colorClass}`}>
            <div className="card-body d-flex justify-content-between align-items-center p-4">
              <div>
                <h5 className="fw-light">{item.title}</h5>
                <h1 className="display-5 fw-bold">{item.value}</h1>
              </div>
              <div style={{ opacity: 0.8 }}>{item.icon}</div>
            </div>
            <div className="card-footer bg-transparent border-0 px-4 pb-3">
              <Link
                to={item.path}
                className="btn btn-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FaEye /> View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}