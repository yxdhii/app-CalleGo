import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  AlertTriangle,
  MapPin,
  Clock,
  Image as ImageIcon,
  X,
} from "lucide-react";

function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];
    setReports(savedReports);
  }, []);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) =>
          filter === "pending"
            ? r.status?.includes("Pendiente")
            : !r.status?.includes("Pendiente")
        );

  const totalPoints = reports.reduce((sum, r) => sum + (r.points || 0), 0);

  return (
    <main className="screen my-reports-screen">
      <header className="my-reports-top">
        <button type="button" onClick={() => navigate("/profile")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Mis reportes</h1>
        <p>{reports.length} reportes · {totalPoints} puntos ganados</p>
      </header>

      <section className="reports-filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Todos
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pendientes
        </button>
        <button
          className={filter === "verified" ? "active" : ""}
          onClick={() => setFilter("verified")}
        >
          Verificados
        </button>
      </section>

      <section className="reports-list">
        {filteredReports.length === 0 ? (
          <div className="reports-empty">
            <AlertTriangle size={34} />
            <p>No hay reportes para mostrar.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <button
              key={report.id}
              type="button"
              className="my-report-card"
              onClick={() => setSelectedReport(report)}
            >
              <div className="my-report-icon">
                <AlertTriangle size={20} />
              </div>

              <div className="my-report-info">
                <div className="my-report-title">
                  <h3>{report.type}</h3>
                  <span
                    className={
                      report.status?.includes("Pendiente")
                        ? "status pending"
                        : "status verified"
                    }
                  >
                    {report.status?.includes("Pendiente")
                      ? "Pendiente"
                      : "Verificado"}
                  </span>
                </div>

                <p>
                  <MapPin size={13} />
                  {report.location}
                </p>

                <p>
                  <Clock size={13} />
                  {report.date || "Sin fecha"}
                </p>

                <small>
                  {report.description || "Sin descripción adicional."}
                </small>
              </div>

              <strong>+{report.points || 0} pts</strong>
            </button>
          ))
        )}
      </section>

      {selectedReport && (
        <section className="report-detail-overlay">
          <article className="report-detail-card">
            <button
              className="detail-close-btn"
              onClick={() => setSelectedReport(null)}
            >
              <X size={20} />
            </button>

            <h2>Detalle del reporte</h2>

            <div className="detail-status-row">
              <span className="detail-type">{selectedReport.type}</span>
              <span
                className={
                  selectedReport.status?.includes("Pendiente")
                    ? "status pending"
                    : "status verified"
                }
              >
                {selectedReport.status?.includes("Pendiente")
                  ? "Pendiente"
                  : "Verificado"}
              </span>
            </div>

            <p className="detail-text">
              {selectedReport.description || "Sin descripción adicional."}
            </p>

            {selectedReport.photo ? (
              <img
                className="detail-report-photo"
                src={selectedReport.photo}
                alt="Evidencia"
              />
            ) : (
              <div className="detail-no-photo">
                <ImageIcon size={32} />
                <span>Sin evidencia fotográfica</span>
              </div>
            )}

            <div className="detail-data">
              <p>
                <MapPin size={15} />
                {selectedReport.location}
              </p>
              <p>
                <Clock size={15} />
                {selectedReport.date || "Sin fecha"}
              </p>
              <p>+{selectedReport.points || 0} puntos obtenidos</p>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}

export default MyReports;