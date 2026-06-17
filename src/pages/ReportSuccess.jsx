import { useNavigate } from "react-router-dom";
import { Check, Star, ShieldCheck, MapPin, AlertTriangle } from "lucide-react";

function ReportSuccess() {
  const navigate = useNavigate();

  const points = Number(localStorage.getItem("callego_points")) || 325;
  const reports = JSON.parse(localStorage.getItem("callego_reports")) || [];
  const lastReport = reports[0];

  return (
    <main className="screen report-success-screen">
      <section className="success-check">
        <Check size={74} />
      </section>

      <h1>¡Reporte enviado!</h1>
      <p>Gracias por contribuir a la seguridad de tu comunidad.</p>

      <section className="success-points-card">
        <div className="success-star">
          <Star size={22} />
        </div>

        <div>
          <span>Puntos ganados</span>
          <h2>+5 pts</h2>
        </div>

        <article>
          <span>Total</span>
          <strong>{points} pts</strong>
        </article>
      </section>

      <section className="reputation-card">
        <div className="rep-header">
          <span>Tu nivel de reputación</span>
          <b>Nuevo</b>
        </div>

        <div className="rep-progress">
          <div
            style={{ width: `${Math.min((points / 500) * 100, 100)}%` }}
          ></div>
        </div>

        <div className="rep-labels">
          <span>Nuevo</span>
          <span>Regular</span>
          <span>Confiable</span>
        </div>

        <p>
          Progreso hacia regular <strong>1 / 5 reportes</strong>
        </p>
      </section>

      <section className="report-summary-card">
        <div>
          <AlertTriangle size={20} />
        </div>

        <article>
          <h3>Resumen del reporte</h3>
          <p>
            {lastReport?.type || "Robo"} ·{" "}
            {lastReport?.location || "Av. Las Flores, SJL"}
          </p>
          <span>Pendiente de validación comunitaria</span>
        </article>
      </section>

      <button className="success-main-btn" onClick={() => navigate("/heatmap")}>
        Volver al mapa
      </button>

      <button
        className="success-secondary-btn"
        onClick={() => navigate("/profile")}
      >
        Ir a mi perfil
      </button>

      <div className="home-indicator"></div>
    </main>
  );
}

export default ReportSuccess;
