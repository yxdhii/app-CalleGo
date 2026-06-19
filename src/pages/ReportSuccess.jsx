import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Star,
  AlertTriangle,
  MapPin,
  Award,
  ShieldCheck,
} from "lucide-react";

function ReportSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const report = location.state?.report;

  const reports = JSON.parse(localStorage.getItem("callego_reports")) || [];
  const isFirstReport = reports.length === 1;

  return (
    <main className="screen report-success-screen">
      <section className="success-main-content">
        <div className="success-header">
          <div className="success-check published">
            <CheckCircle2 size={38} />
          </div>

          <h1>¡Reporte publicado!</h1>

          <p>
            Tu aviso ya está visible para la comunidad. Los puntos se asignarán
            cuando sea validado.
          </p>
        </div>

        <section className="success-points-card">
          <div className="success-star">
            <Star size={22} />
          </div>

          <div>
            <span>Puntos pendientes</span>
            <h2>0 pts</h2>
          </div>

          <article>
            <span>Validación</span>
            <strong>En revisión</strong>
          </article>
        </section>

        <section className="reputation-card">
          <div className="rep-header">
            <span>Tu nivel de reputación</span>
            <b>Nuevo</b>
          </div>

          <div className="rep-progress">
            <div style={{ width: "0%" }}></div>
          </div>

          <div className="rep-labels">
            <span>Nuevo</span>
            <span>Regular</span>
            <span>Confiable</span>
          </div>

          <p>
            Progreso hacia regular
            <strong>0/20 pts</strong>
          </p>
        </section>

        {isFirstReport && (
          <section className="badge-unlocked-card">
            <Award size={22} />
            <div>
              <strong>Insignia desbloqueada</strong>
              <p>Primer reporte publicado</p>
            </div>
          </section>
        )}

        <section className="report-summary-card">
          <div>
            <AlertTriangle size={22} />
          </div>

          <article>
            <h3>Resumen del reporte</h3>
            <p>
              {report?.type || "Incidente"} ·{" "}
              {report?.location || "Ubicación detectada"}
            </p>
            <span>Publicado · pendiente de validación comunitaria</span>
          </article>
        </section>

        <section className="validation-info-card">
          <ShieldCheck size={20} />

          <p>
            Si otros usuarios confirman el aviso, el reporte podrá ser validado
            y recibirás puntos de reputación.
          </p>
        </section>

        <button
          className="success-main-btn"
          onClick={() => navigate("/heatmap")}
        >
          <MapPin size={20} />
          Volver al mapa
        </button>

        <button
          className="success-secondary-btn"
          onClick={() => navigate("/my-reports")}
        >
          Ver mis reportes
        </button>
      </section>
    </main>
  );
}

export default ReportSuccess;
