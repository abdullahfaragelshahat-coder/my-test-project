import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  blood_group: "",
  address: "",
};

function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);
  const bsEditModal = useRef(null);
  const bsViewModal = useRef(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchPatients = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/patients",
        { headers }
      );

      setPatients(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load patients");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPatients();

    if (editModalRef.current) {
      bsEditModal.current = new Modal(editModalRef.current);
    }
    if (viewModalRef.current) {
      bsViewModal.current = new Modal(viewModalRef.current);
    }

    return () => {
      bsEditModal.current?.dispose();
      bsViewModal.current?.dispose();
    };
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    bsEditModal.current?.show();
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "",
      email: p.email || "",
      phone: p.phone || "",
      date_of_birth: p.date_of_birth || "",
      gender: p.gender || "",
      blood_group: p.blood_group || "",
      address: p.address || "",
    });
    bsEditModal.current?.show();
  };

  const openViewModal = (p) => {
    setSelectedPatient(p);
    bsViewModal.current?.show();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("date_of_birth", formData.date_of_birth);
    data.append("gender", formData.gender);
    data.append("blood_group", formData.blood_group);
    data.append("address", formData.address);

    setLoading(true);

    try {
      if (editingId) {
        data.append("_method", "PUT");

        await axios.post(
          `http://127.0.0.1:8000/api/patients/${editingId}`,
          data,
          { headers }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/patients",
          data,
          { headers }
        );
      }

      toast.success("Patient Saved Successfully");

      bsEditModal.current?.hide();
      setFormData(emptyForm);
      setEditingId(null);
      fetchPatients();
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Operation Failed");
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Patient ?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/patients/${id}`, {
        headers,
      });

      toast.success("Patient Deleted");

      const remaining = patients.filter((p) => p.id !== id);
      const maxPage = Math.max(1, Math.ceil(remaining.length / patientsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);

      fetchPatients();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const term = search.toLowerCase();
    return (
      (patient.name || "").toLowerCase().includes(term) ||
      (patient.email || "").toLowerCase().includes(term) ||
      (patient.phone || "").toLowerCase().includes(term)
    );
  });

  const last = currentPage * patientsPerPage;
  const first = last - patientsPerPage;

  const currentPatients = filteredPatients.slice(first, last);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🧑 Patients Management</h2>

        <div className="d-flex">
          <input
            className="form-control me-3"
            style={{ width: "250px" }}
            placeholder="🔍 Search Patient..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button className="btn btn-success text-nowrap" onClick={openAddModal}>
            + Add Patient
          </button>
        </div>
      </div>

      {fetching ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <table className="table table-hover shadow">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Blood</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPatients.length > 0 ? (
              currentPatients.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.date_of_birth}</td>
                  <td>{p.gender}</td>
                  <td>{p.blood_group}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(p)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => openViewModal(p)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Patients Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add / Edit Modal */}
      <div className="modal fade" id="patientModal" tabIndex="-1" ref={editModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingId ? "Edit Patient" : "Add Patient"}
              </h5>

              <button
                className="btn-close"
                onClick={() => bsEditModal.current?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="form-control mb-2"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <input
                className="form-control mb-2"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <input
                type="date"
                className="form-control mb-2"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />

              <select
                className="form-control mb-2"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                className="form-control mb-2"
                value={formData.blood_group}
                onChange={(e) =>
                  setFormData({ ...formData, blood_group: e.target.value })
                }
              >
                <option value="">Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <textarea
                className="form-control"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                disabled={loading}
                onClick={() => bsEditModal.current?.hide()}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={loading} onClick={handleSubmit}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewPatient" tabIndex="-1" ref={viewModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Patient Details</h5>
              <button
                className="btn-close"
                onClick={() => bsViewModal.current?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              {selectedPatient && (
                <>
                  <h4 className="text-center">{selectedPatient.name}</h4>
                  <hr />
                  <p>
                    <b>Email :</b> {selectedPatient.email}
                  </p>
                  <p>
                    <b>Phone :</b> {selectedPatient.phone}
                  </p>
                  <p>
                    <b>Date of Birth :</b> {selectedPatient.date_of_birth}
                  </p>
                  <p>
                    <b>Gender :</b> {selectedPatient.gender}
                  </p>
                  <p>
                    <b>Blood Group :</b> {selectedPatient.blood_group}
                  </p>
                  <p>
                    <b>Address :</b> {selectedPatient.address}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;