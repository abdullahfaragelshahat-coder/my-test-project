import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Settings() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [language, setLanguage] = useState("ar");

  const handleSave = () => {
    // ابعت القيم دي للـ API بتاعك
    console.log({ notifEmail, notifSms, language });
    alert("تم حفظ الإعدادات");
  };

  return (
    <div className="container py-4">
      <Link
        to="/"
        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 mb-3"
      >
        <FaArrowRight /> Back Dahboard
      </Link>

      <h2 className="fw-bold mb-4">الإعدادات</h2>

      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <h5 className="mb-3">الإشعارات</h5>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="notifEmail"
              checked={notifEmail}
              onChange={(e) => setNotifEmail(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="notifEmail">
              إشعارات البريد الإلكتروني
            </label>
          </div>

          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="notifSms"
              checked={notifSms}
              onChange={(e) => setNotifSms(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="notifSms">
              إشعارات الرسائل النصية
            </label>
          </div>

          <h5 className="mb-3">اللغة</h5>
          <select
            className="form-select mb-4"
            style={{ maxWidth: 250 }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>

          <button className="btn btn-primary" onClick={handleSave}>
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}