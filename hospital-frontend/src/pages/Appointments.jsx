import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/appointments", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setAppointments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // هنا التأكد: إذا كان editingId موجود، نرسل PUT، وإلا POST
      if (editingId) {
        console.log("إرسال بيانات التعديل:", formData); // طبع البيانات في الكونسول للتأكد
        await axios.put(`http://127.0.0.1:8000/api/appointments/${editingId}`, formData, config);
        toast.success("تم التعديل بنجاح");
      } else {
        await axios.post("http://127.0.0.1:8000/api/appointments", formData, config);
        toast.success("تمت الإضافة بنجاح");
      }
      
      // ... باقي الكود
    } catch (error) {
      // هنا السر: اطبع الخطأ بالتفصيل في الكونسول
      console.error("تفاصيل الخطأ:", error.response?.data); 
      toast.error("خطأ: " + JSON.stringify(error.response?.data.message || "حدث خطأ"));
    }
    setLoading(false);
};
  const handleDelete = async (id) => {
    if (!window.confirm("Delete Appointment?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchAppointments();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const filteredAppointments = appointments.filter((a) => String(a.id).includes(search));
  const currentAppointments = filteredAppointments.slice((currentPage - 1) * appointmentsPerPage, currentPage * appointmentsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📅 Appointments</h2>
        <div className="d-flex">
          <input className="form-control me-2" placeholder="Search ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-success" onClick={() => { setEditingId(null); setFormData({ doctor_id: "", patient_id: "", appointment_date: "", appointment_time: "", status: "pending" }); }} data-bs-toggle="modal" data-bs-target="#appointmentModal">+ Add</button>
        </div>
      </div>

      <table className="table table-hover shadow">
        <thead className="table-dark">
          <tr><th>ID</th><th>Doctor</th><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {currentAppointments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.doctor}</td>
              <td>{a.patient}</td>
              <td>{a.appointment_date}</td>
              <td>{a.appointment_time}</td>
              <td>{a.status}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditingId(a.id); setFormData({ doctor_id: a.doctor_id, patient_id: a.patient_id, appointment_date: a.appointment_date, appointment_time: a.appointment_time, status: a.status }); }} data-bs-toggle="modal" data-bs-target="#appointmentModal"><FaEdit /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <div className="modal fade" id="appointmentModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>{editingId ? "Edit" : "Add"}</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Doctor ID" value={formData.doctor_id} onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })} />
              <input className="form-control mb-2" placeholder="Patient ID" value={formData.patient_id} onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })} />
              <input type="date" className="form-control mb-2" value={formData.appointment_date} onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })} />
              <input type="time" className="form-control mb-2" value={formData.appointment_time} onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })} />
              <select className="form-control" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;