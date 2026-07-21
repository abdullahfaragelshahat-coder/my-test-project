import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  department_id: "",
  image: null,
};

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const getHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const postHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  };

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);
  const bsEditModal = useRef(null);
  const bsViewModal = useRef(null);

  const fetchDoctors = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/doctors",
        { headers: getHeaders }
      );
      setDoctors(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load doctors");
    } finally {
      setFetching(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/departments",
        { headers: getHeaders }
      );
      setDepartments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();

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

  const openEditModal = (doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      department_id: doctor.department_id || "",
      image: doctor.image || null,
    });
    bsEditModal.current?.show();
  };

  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor);
    bsViewModal.current?.show();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.department_id) {
      toast.error("Name, Email and Department are required");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("specialization", formData.specialization);
      data.append("department_id", formData.department_id);

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      let response;
      if (editingId) {
        data.append("_method", "PUT");
        response = await axios.post(
          `http://127.0.0.1:8000/api/doctors/${editingId}`,
          data,
          { headers: postHeaders }
        );
        // تحديث لحظي للتعديل
        setDoctors((prev) => prev.map((d) => (d.id === editingId ? response.data.data : d)));
      } else {
        response = await axios.post(
          "http://127.0.0.1:8000/api/doctors",
          data,
          { headers: postHeaders }
        );
        // تحديث لحظي للإضافة
        setDoctors((prev) => [...prev, response.data.data]);
      }

      toast.success("Doctor Saved Successfully");
      bsEditModal.current?.hide();
      setEditingId(null);
      setFormData(emptyForm);
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor ?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}`, {
        headers: getHeaders,
      });

      toast.success("Doctor Deleted");
      // تحديث لحظي للحذف
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      
      const remaining = doctors.filter((d) => d.id !== id);
      const maxPage = Math.max(1, Math.ceil(remaining.length / doctorsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    } catch {
      toast.error("Delete Failed");
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const term = search.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(term) ||
      doctor.email?.toLowerCase().includes(term) ||
      doctor.phone?.toLowerCase().includes(term) ||
      doctor.specialization?.toLowerCase().includes(term) ||
      doctor.department?.toLowerCase().includes(term)
    );
  });

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <FaUserMd className="me-2 text-primary" />
          Doctors Management
        </h2>

        <div className="d-flex">
          <input
            className="form-control me-3"
            placeholder="Search Doctor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button className="btn btn-success text-nowrap" onClick={openAddModal}>
            + Add Doctor
          </button>
        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">
          {fetching ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Doctor</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.length > 0 ? (
                  currentDoctors.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              d.image
                                ? `http://127.0.0.1:8000/storage/${d.image}`
                                : "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(d.name || "Doctor")
                            }
                            alt={d.name}
                            width="60"
                            height="60"
                            className="rounded-circle border shadow-sm me-3"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <div className="fw-bold">{d.name}</div>
                            <small className="text-muted">{d.specialization}</small>
                          </div>
                        </div>
                      </td>
                      <td>{d.email}</td>
                      <td>{d.phone}</td>
                      <td>{d.department}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => openEditModal(d)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => openViewModal(d)}
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(d.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Doctors Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
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
        </nav>
      )}

      {/* Add / Edit Modal */}
      <div className="modal fade" id="doctorModal" tabIndex="-1" ref={editModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? "Edit Doctor" : "Add Doctor"}</h5>
              <button
                className="btn-close"
                onClick={() => bsEditModal.current?.hide()}
              />
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-3"
                placeholder="Doctor Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="form-control mb-3"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <input
                className="form-control mb-3"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <input
                className="form-control mb-3"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
              />

              <select
                className="form-control mb-3"
                value={formData.department_id}
                onChange={(e) =>
                  setFormData({ ...formData, department_id: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />

              {formData.image && (
                <img
                  src={
                    typeof formData.image === "string"
                      ? `http://127.0.0.1:8000/storage/${formData.image}`
                      : URL.createObjectURL(formData.image)
                  }
                  width="130"
                  height="130"
                  className="rounded-circle d-block mx-auto"
                  style={{ objectFit: "cover" }}
                  alt="Doctor preview"
                />
              )}
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
      <div className="modal fade" id="viewDoctor" tabIndex="-1" ref={viewModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Doctor Details</h5>
              <button
                className="btn-close"
                onClick={() => bsViewModal.current?.hide()}
              />
            </div>

            <div className="modal-body text-center">
              {selectedDoctor && (
                <>
                  <img
                    src={
                      selectedDoctor.image
                        ? `http://127.0.0.1:8000/storage/${selectedDoctor.image}`
                        : "https://cdn-icons-png.flaticon.com/512/387/387561.png"
                    }
                    width="150"
                    height="150"
                    className="rounded-circle shadow"
                    style={{ objectFit: "cover" }}
                    alt={selectedDoctor.name}
                  />
                  <h3 className="mt-3">{selectedDoctor.name}</h3>
                  <hr />
                  <p>
                    <b>Email :</b> {selectedDoctor.email}
                  </p>
                  <p>
                    <b>Phone :</b> {selectedDoctor.phone}
                  </p>
                  <p>
                    <b>Department :</b> {selectedDoctor.department}
                  </p>
                  <p>
                    <b>Specialization :</b> {selectedDoctor.specialization}
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

export default Doctors;