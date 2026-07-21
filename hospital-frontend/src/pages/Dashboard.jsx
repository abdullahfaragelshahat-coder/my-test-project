import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaUserMd,
  FaUserInjured,
  FaPills,
  FaHospital,
  FaCalendarAlt,
  FaFileMedical,
} from "react-icons/fa";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import DashboardTopbar from "../components/DashboardTopbar";
import StatsGrid from "../components/StatsGrid";
import DashboardCharts from "../components/DashboardCharts";
import ProgressBars from "../components/ProgressBars";
import RecentActivity from "../components/RecentActivity";

import "../components/dashboard.css";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://127.0.0.1:8000/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboard(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  if (!dashboard) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  const stats = [
    {
      title: "الأطباء",
      value: dashboard.total_doctors || 0,
      icon: <FaUserMd size={40} />,
      colorClass: "stat-card-doctors",
      path: "/doctors",
    },
    {
      title: "المرضى",
      value: dashboard.total_patients || 0,
      icon: <FaUserInjured size={40} />,
      colorClass: "stat-card-patients",
      path: "/patients",
    },
    {
      title: "الأدوية",
      value: dashboard.total_medicines || 0,
      icon: <FaPills size={40} />,
      colorClass: "stat-card-medicines",
      path: "/medicines",
    },
    {
      title: "المواعيد",
      value: dashboard.total_appointments || 0,
      icon: <FaCalendarAlt size={40} />,
      colorClass: "stat-card-appointments",
      path: "/appointments",
    },
    {
      title: "الوصفات الطبية",
      value: dashboard.total_prescriptions || 0,
      icon: <FaFileMedical size={40} />,
      colorClass: "stat-card-prescriptions",
      path: "/prescriptions",
    },
  ];

  const chartData = {
    labels: ["Doctors", "Patients", "Medicines", "Appointments"],
    datasets: [
      {
        label: "Overview",
        data: [
          dashboard.total_doctors,
          dashboard.total_patients,
          dashboard.total_medicines,
          dashboard.total_appointments,
        ],
        backgroundColor: "rgba(54,162,235,.7)",
      },
    ],
  };

  const pieData = {
    labels: ["Doctors", "Patients", "Medicines"],
    datasets: [
      {
        data: [
          dashboard.total_doctors,
          dashboard.total_patients,
          dashboard.total_medicines,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  };

  const lineData = {
    labels: ["Doctors", "Patients", "Medicines", "Appointments"],
    datasets: [
      {
        label: "Hospital Overview",
        data: [
          dashboard.total_doctors,
          dashboard.total_patients,
          dashboard.total_medicines,
          dashboard.total_appointments,
        ],
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54,162,235,.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text("Hospital Dashboard Report", 14, 15);

    doc.autoTable({
      head: [["Metric", "Value"]],
      body: stats.map((s) => [s.title, s.value]),
    });

    doc.save("report.pdf");
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stats);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Stats");
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <div className={`dashboard-wrapper ${darkMode ? "dark-mode" : ""}`}>
      <DashboardTopbar
        currentUser={{
          name: "Admin",
          role: "Admin",
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onPrint={() => window.print()}
      />

      <StatsGrid stats={stats} />

      <DashboardCharts
        chartData={chartData}
        pieData={pieData}
        lineData={lineData}
      />

      <ProgressBars
        doctorsProgress={Math.min(100, dashboard.total_doctors * 10)}
        patientsProgress={Math.min(100, dashboard.total_patients * 20)}
      />

      <RecentActivity />
    </div>
  );
}