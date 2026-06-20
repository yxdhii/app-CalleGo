import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  Eye,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];
    setReports(savedReports);
  }, []);

  const totalReports = reports.length;
  const verifiedReports = reports.filter(
    (r) => r.status === "Verificado",
  ).length;
  const pendingReports = reports.filter(
    (r) => r.status !== "Verificado",
  ).length;
  const totalPoints = reports.reduce((sum, r) => sum + (r.points || 0), 0);

  const countByType = (type) =>
    reports.filter((r) => r.type?.toLowerCase() === type).length;

  const types = [
    { label: "Robo", value: countByType("robo") },
    { label: "Acoso", value: countByType("acoso") },
    { label: "Accidente", value: countByType("accidente") },
    {
      label: "Zona oscura",
      value: countByType("oscura") + countByType("zona oscura"),
    },
  ];

  const maxType = Math.max(...types.map((t) => t.value), 1);

  return (
    <main className="screen dashboard-screen">
      <header className="dashboard-header">
        <button type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Dashboard</h1>
        <p>Resumen de actividad, validación y transparencia.</p>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-stat">
          <AlertTriangle size={22} />
          <h3>{totalReports}</h3>
          <p>Reportes</p>
        </div>

        <div className="dashboard-stat">
          <CheckCircle2 size={22} />
          <h3>{verifiedReports}</h3>
          <p>Verificados</p>
        </div>

        <div className="dashboard-stat">
          <Clock size={22} />
          <h3>{pendingReports}</h3>
          <p>En revisión</p>
        </div>

        <div className="dashboard-stat">
          <Star size={22} />
          <h3>{totalPoints}</h3>
          <p>Puntos</p>
        </div>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-card-title">
          <BarChart3 size={18} />
          <h2>Tipos de incidente</h2>
        </div>

        {types.map((item) => (
          <div className="incident-bar" key={item.label}>
            <div className="incident-bar-top">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>

            <div className="incident-bar-track">
              <div style={{ width: `${(item.value / maxType) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-card">
        <div className="dashboard-card-title">
          <ShieldCheck size={18} />
          <h2>Validación comunitaria</h2>
        </div>

        <p className="dashboard-text">
          Los reportes publicados pasan a revisión. Si otros usuarios los
          confirman, pueden ser validados y sumar puntos de reputación.
        </p>
      </section>
      
      <section className="dashboard-card">
        <div className="dashboard-card-title">
          <AlertTriangle size={18} />
          <h2>Control de falsas alertas</h2>
        </div>

        <p className="dashboard-text">
          Los reportes marcados como falsos pueden ser descartados. Estos no
          suman puntos y reducen la confiabilidad del usuario.
        </p>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-card-title">
          <Eye size={18} />
          <h2>Transparencia</h2>
        </div>

        <p className="dashboard-text">
          Cada reporte muestra estado, fecha, ubicación, reacciones y nivel de
          validación para reducir alertas falsas.
        </p>
      </section>
    </main>
  );
}

export default Dashboard;
