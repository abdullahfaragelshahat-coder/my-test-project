import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

const emptyForm = {
  name: "",
  description: "",
};

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);
  const bsEditModal = useRef(null);
  const bsViewModal = useRef(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchDepartments = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/departments",
        { headers }
      );

      setDepartments(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load departments");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
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

  const openEditModal = (d) => {
    setEditingId(d.id);
    setFormData({
      name: d.name || "",
      description: d.description || "",
    });
    bsEditModal.current?.show();
  };

  const openViewModal = (d) => {
    setSelectedDepartment(d);
    bsViewModal.current?.show();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/departments/${editingId}`,
          formData,
          { headers }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/departments",
          formData,
          { headers }
        );
      }

      toast.success("Department Saved");

      bsEditModal.current?.hide();
      setFormData(emptyForm);
      setEditingId(null);
      fetchDepartments();
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
    if (!window.confirm("Delete Department?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/departments/${id}`, {
        headers,
      });

      toast.success("Department Deleted");

      const remaining = departments.filter((d) => d.id !== id);
      const maxPage = Math.max(1, Math.ceil(remaining.length / departmentsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);

      fetchDepartments();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const filteredDepartments = departments.filter((department) =>
    (department.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const last = currentPage * departmentsPerPage;
  const first = last - departmentsPerPage;

  const currentDepartments = filteredDepartments.slice(first, last);

  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏢 Departments Management</h2>

        <div className="d-flex">
          <input
            className="form-control me-3"
            placeholder="Search Department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button className="btn btn-success text-nowrap" onClick={openAddModal}>
            + Add Department
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
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentDepartments.length > 0 ? (
              currentDepartments.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.description}</td>

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
                <td colSpan="4" className="text-center">
                  No Departments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
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
      <div className="modal fade" id="departmentModal" tabIndex="-1" ref={editModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{editingId ? "Edit Department" : "Add Department"}</h5>

              <button
                className="btn-close"
                onClick={() => bsEditModal.current?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-3"
                placeholder="Department Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <textarea
                className="form-control"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                disabled={loading}
                onClick={() => bsEditModal.current?.hide()}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewDepartment" tabIndex="-1" ref={viewModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Department Details</h5>
              <button
                className="btn-close"
                onClick={() => bsViewModal.current?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              {selectedDepartment && (
                <>
                  <h4>{selectedDepartment.name}</h4>
                  <hr />
                  <p>{selectedDepartment.description || "No description provided."}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Departments;