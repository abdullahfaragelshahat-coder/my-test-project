import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

const emptyForm = {
  name: "",
  company: "",
  quantity: "",
  price: "",
};

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 5;

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);
  const bsEditModal = useRef(null);
  const bsViewModal = useRef(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchMedicines = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/medicines",
        { headers }
      );

      setMedicines(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load medicines");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMedicines();

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

  const openEditModal = (m) => {
    setEditingId(m.id);
    setFormData({
      name: m.name || "",
      company: m.company || "",
      quantity: m.quantity ?? "",
      price: m.price ?? "",
    });
    bsEditModal.current?.show();
  };

  const openViewModal = (m) => {
    setSelectedMedicine(m);
    bsViewModal.current?.show();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.company.trim()) {
      toast.error("Name and Company are required");
      return;
    }

    const quantity = Number(formData.quantity);
    const price = Number(formData.price);

    if (formData.quantity === "" || isNaN(quantity) || quantity < 0) {
      toast.error("Quantity must be a valid non-negative number");
      return;
    }

    if (formData.price === "" || isNaN(price) || price < 0) {
      toast.error("Price must be a valid non-negative number");
      return;
    }

    const payload = {
      name: formData.name,
      company: formData.company,
      quantity,
      price,
    };

    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/medicines/${editingId}`,
          payload,
          { headers }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/medicines",
          payload,
          { headers }
        );
      }

      toast.success("Medicine Saved Successfully");

      bsEditModal.current?.hide();
      setFormData(emptyForm);
      setEditingId(null);
      fetchMedicines();
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
    if (!window.confirm("Delete Medicine?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/medicines/${id}`, {
        headers,
      });

      toast.success("Medicine Deleted");

      const remaining = medicines.filter((m) => m.id !== id);
      const maxPage = Math.max(1, Math.ceil(remaining.length / medicinesPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);

      fetchMedicines();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    (medicine.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const last = currentPage * medicinesPerPage;
  const first = last - medicinesPerPage;

  const currentMedicines = filteredMedicines.slice(first, last);

  const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💊 Medicines Management</h2>

        <div className="d-flex">
          <input
            className="form-control me-3"
            placeholder="Search Medicine..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <button className="btn btn-success text-nowrap" onClick={openAddModal}>
            + Add Medicine
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
              <th>Company</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentMedicines.length > 0 ? (
              currentMedicines.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.name}</td>
                  <td>{m.company}</td>
                  <td className={m.quantity <= 10 ? "text-danger fw-bold" : ""}>
                    {m.quantity}
                  </td>
                  <td>{m.price}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(m)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => openViewModal(m)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(m.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Medicines Found
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
      <div className="modal fade" id="medicineModal" tabIndex="-1" ref={editModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{editingId ? "Edit Medicine" : "Add Medicine"}</h5>

              <button
                className="btn-close"
                onClick={() => bsEditModal.current?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-2"
                placeholder="Medicine Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="form-control mb-2"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />

              <input
                type="number"
                min="0"
                className="form-control mb-2"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />

              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewMedicine" tabIndex="-1" ref={viewModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Medicine Details</h5>
              <button
                className="btn-close"
                onClick={() => bsViewModal.current?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              {selectedMedicine && (
                <>
                  <h4>{selectedMedicine.name}</h4>
                  <hr />
                  <p>
                    <b>Company :</b> {selectedMedicine.company}
                  </p>
                  <p>
                    <b>Quantity :</b> {selectedMedicine.quantity}
                  </p>
                  <p>
                    <b>Price :</b> {selectedMedicine.price}
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

export default Medicines;