import { FaClock, FaCheckCircle, FaUserPlus, FaUserInjured, FaPills, FaCalendarCheck, FaFilePrescription } from "react-icons/fa";

export default function RecentActivity({ activities = [] }) {
  // داتا افتراضية لو الـ API لسه موصلش
  const list = activities.length > 0 ? activities : [
    "New doctor added",
    "New patient registered",
    "Medicine stock updated",
    "New appointment booked",
    "New prescription created"
  ];

  const getIcon = (text) => {
    if (text.includes("doctor")) return <FaUserPlus className="text-primary" />;
    if (text.includes("patient")) return <FaUserInjured className="text-info" />;
    if (text.includes("Medicine")) return <FaPills className="text-warning" />;
    if (text.includes("appointment")) return <FaCalendarCheck className="text-success" />;
    return <FaFilePrescription className="text-danger" />;
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mt-4">
      <div className="card-header bg-white border-0 py-3 px-4">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <FaClock className="text-secondary" /> Recent Activity
        </h5>
      </div>
      <div className="card-body px-4">
        <div className="timeline">
          {list.map((activity, index) => (
            <div key={index} className="d-flex align-items-center gap-3 mb-3">
              <div className="icon-wrapper d-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: 40, height: 40 }}>
                {getIcon(activity)}
              </div>
              <div className="flex-grow-1 border-bottom pb-2">
                <p className="mb-0 fw-semibold text-dark">{activity}</p>
                <small className="text-muted">Just now</small>
              </div>
              <FaCheckCircle className="text-success" size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}