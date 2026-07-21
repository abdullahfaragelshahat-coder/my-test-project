import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardCharts({ chartData, pieData, lineData }) {
  return (
    <>
      <div className="row mt-5">
        <div className="col-lg-8">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">📊 إحصائيات المستشفى</h4>
            </div>
            <div className="card-body">
              <Bar data={chartData} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">🥧 التوزيع</h4>
            </div>
            <div className="card-body">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 rounded-4 mt-4">
        <div className="card-header bg-white">
          <h4 className="mb-0">📈 نمو المستشفى</h4>
        </div>
        <div className="card-body">
          <Line data={lineData} />
        </div>
      </div>
    </>
  );
}