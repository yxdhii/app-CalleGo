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

  const points = reports.reduce((sum, r) => sum + (r.points || 0), 0);

  const getLevel = (points) => {
    if (points >= 500) {
      return { name: "Guardián", next: "Nivel máximo", max: 500 };
    }

    if (points >= 100) {
      return { name: "Confiable", next: "Guardián", max: 500 };
    }

    if (points >= 20) {
      return { name: "Regular", next: "Confiable", max: 100 };
    }

    return { name: "Nuevo", next: "Regular", max: 20 };
  };

  const level = getLevel(points);
  const progressPct = Math.min(100, (points / level.max) * 100);

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
            <h2>5 pts</h2>
          </div>

          <article>
            <span>Validación</span>
            <strong>En revisión</strong>
          </article>
        </section>

        <section className="reputation-card">
          <div className="rep-header">
            <span>Tu reputación actual</span>
            <b>{level.name}</b>
          </div>

          <div className="rep-progress">
            <div style={{ width: `${progressPct}%` }}></div>
          </div>

          <div className="rep-labels">
            <span>{level.name}</span>
            <span>{level.next}</span>
          </div>

          <p>
            Progreso de reputación
            <strong>
              {points}/{level.max} pts
            </strong>
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
