import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Bell,
  ShieldCheck,
  Award,
  Volume2,
  MapPin,
  AlertTriangle,
  Star,
} from "lucide-react";

function Notifications() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    proximity: true,
    validated: true,
    badges: true,
    sound: true,
  });

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const savedSettings =
      JSON.parse(localStorage.getItem("callego_notification_settings")) || null;

    if (savedSettings) setSettings(savedSettings);

    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];

    setReports(savedReports);
  }, []);

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem(
      "callego_notification_settings",
      JSON.stringify(updated),
    );
  };

  const configItems = [
    {
      key: "proximity",
      title: "Alertas de proximidad",
      text: "Recibe avisos de incidentes cercanos.",
      icon: MapPin,
      color: "blue",
      action: () => navigate("/alerts"),
    },
    {
      key: "validated",
      title: "Reportes validados",
      text: "Cuando tu reporte gane puntos.",
      icon: ShieldCheck,
      color: "green",
    },
    {
      key: "badges",
      title: "Nuevas insignias",
      text: "Logros desbloqueados en CalleGo.",
      icon: Award,
      color: "yellow",
    },
    {
      key: "sound",
      title: "Sonido",
      text: "Activar sonido en las alertas.",
      icon: Volume2,
      color: "purple",
    },
  ];

  const verifiedReports = reports.filter((r) => r.status === "Verificado");

  return (
    <main className="screen notifications-screen">
      <header className="notifications-header">
        <button type="button" onClick={() => navigate("/profile")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Notificaciones</h1>
        <p>Configura tus avisos y revisa tu actividad reciente.</p>
      </header>

      <section className="notification-card">
        <h3>Configuración</h3>

        {configItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="notification-row"
              onClick={item.action}
            >
              <div className="notification-left">
                <div className={`notification-icon ${item.color}`}>
                  <Icon size={20} />
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>

              <button
                type="button"
                className={`notify-switch ${
                  settings[item.key] ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSetting(item.key);
                }}
              >
                <span></span>
              </button>
            </div>
          );
        })}
      </section>

      <section className="notification-card">
        <h3>Actividad reciente</h3>

        {reports.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={30} />
            <p>Aún no tienes actividad reciente.</p>
          </div>
        ) : (
          reports.slice(0, 4).map((report) => (
            <div className="activity-item" key={report.id}>
              <div
                className={`notification-icon ${
                  report.status === "Verificado" ? "green" : "red"
                }`}
              >
                <AlertTriangle size={19} />
              </div>

              <div>
                <h4>
                  Reporte{" "}
                  {report.status === "Verificado" ? "validado" : "en revisión"}
                </h4>
                <p>
                  {report.type} · {report.location}
                </p>
                <span>{report.date || "Sin fecha"}</span>
              </div>
            </div>
          ))
        )}

        {verifiedReports.length >= 1 && (
          <div className="activity-item">
            <div className="notification-icon yellow">
              <Star size={19} />
            </div>

            <div>
              <h4>Insignia desbloqueada</h4>
              <p>Primer reporte publicado.</p>
              <span>Logro obtenido</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Notifications;
