import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

function Login({ setToken }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      toast.success("Login Successfully");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="med-login-container">
      {/* الجانب التجميلي العصري */}
      <div className="med-brand-side">
        <div className="brand-overlay"></div>
        <div className="brand-top">
          <div className="logo-icon-wrap">
            <HospitalMark />
          </div>
          <span className="brand-title">CuraPulse Medical</span>
        </div>

        <div className="brand-center">
          <h2>إدارة المستشفيات الذكية<br />بأعلى معايير الأمان</h2>
          <p>منصة موحدة للطواقم الطبية لمتابعة الأقسام، المرضى، والملفات الحيوية بلحظتها وبدقة فائقة.</p>
        </div>

        <div className="brand-bottom">
          <div className="live-indicator">
            <span className="pulsing-dot"></span>
            <span>الأنظمة الطبية متصلة وتعمل بكفاءة</span>
          </div>
        </div>
      </div>

      {/* جانب الفورم بتصميم نظيف وفخم */}
      <div className="med-form-side">
        <div className="med-card">
          <div className="mobile-header">
            <HospitalMark />
            <span>CuraPulse</span>
          </div>

          <div className="card-heading">
            <span className="badge-tag">بوابة الموظفين</span>
            <h2>أهلاً بك مجدداً</h2>
            <p>سجل دخولك للمتابعة إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="med-input-group">
              <label htmlFor="login-email">البريد الإلكتروني</label>
              <input
                id="login-email"
                type="email"
                placeholder="name@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="med-input-group">
              <label htmlFor="login-password">كلمة المرور</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="med-submit-btn" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="med-footer-link">
            ليس لديك حساب؟
            <Link to="/register">إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function HospitalMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="#0284c7" opacity="0.15" />
      <path d="M12 7v10M7 12h10" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default Login;