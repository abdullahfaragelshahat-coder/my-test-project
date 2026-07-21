export default function ProgressBars({ doctorsProgress = 0, patientsProgress = 0 }) {
  return (
    <div className="row mt-4">
      <div className="col-md-6">
        <div className="card shadow border-0 rounded-4">
          <div className="card-body">
            <h5>نسبة الأطباء</h5>
            <div className="progress mt-3">
              <div className="progress-bar progress-bar-doctors" style={{ width: `${doctorsProgress}%` }}>
                {doctorsProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow border-0 rounded-4">
          <div className="card-body">
            <h5>نسبة المرضى</h5>
            <div className="progress mt-3">
              <div className="progress-bar progress-bar-patients" style={{ width: `${patientsProgress}%` }}>
                {patientsProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}