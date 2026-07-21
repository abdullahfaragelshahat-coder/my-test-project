import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaArrowRight,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function Profile() {
  // البيانات الأصلية (استبدلها ببيانات المستخدم الحقيقية من الـ API / الـ context بتاعك)
  const initialUser = {
    name: "Admin User",
    email: "admin@hospital.com",
    phone: "01000000000",
    role: "Admin",
    avatar: null,
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUser);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = () => {
    setFormData(user); // نبدأ الفورم بآخر بيانات محفوظة
    setMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // غيّر الـ endpoint ده لمسار تحديث البروفايل الحقيقي عندك
      await axios.put("/api/profile", formData);

      setUser(formData);
      setIsEditing(false);
      setMessage({ type: "success", text: "تم حفظ البيانات بنجاح" });
    } catch (error) {
      console.error("خطأ في حفظ بيانات البروفايل:", error);
      setMessage({ type: "error", text: "حصل خطأ أثناء الحفظ، حاول تاني" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <Link
        to="/"
        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 mb-3"
      >
        <FaArrowRight /> Back Dashboard
      </Link>

      <h2 className="fw-bold mb-4">الملف الشخصي</h2>

      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-circle"
                width={80}
                height={80}
              />
            ) : (
              <FaUserCircle size={80} className="text-secondary" />
            )}
            <div>
              <h4 className="mb-1">{user.name}</h4>
              <span className="badge bg-primary d-inline-flex align-items-center gap-1">
                <FaShieldAlt size={12} /> {user.role}
              </span>
            </div>
          </div>

          {message && (
            <div
              className={`alert ${
                message.type === "success" ? "alert-success" : "alert-danger"
              }`}
            >
              {message.text}
            </div>
          )}

          {!isEditing ? (
            <>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center gap-2">
                  <FaEnvelope className="text-primary" /> {user.email}
                </li>
                <li className="list-group-item d-flex align-items-center gap-2">
                  <FaPhone className="text-primary" /> {user.phone}
                </li>
              </ul>

              <button className="btn btn-primary mt-4" onClick={handleEditClick}>
                تعديل البيانات
              </button>
            </>
          ) : (
            <div className="mt-3">
              <div className="mb-3">
                <label className="form-label">الاسم</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FaSave /> {saving ? "جاري الحفظ..." : "حفظ"}
                </button>

                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FaTimes /> إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}