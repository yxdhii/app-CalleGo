import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  AlertTriangle,
  Users,
  Car,
  Moon,
  ShieldAlert,
  Bell,
} from "lucide-react";

const incidentTypes = [
  { key: "robo", label: "Robo", icon: AlertTriangle, color: "red" },
  { key: "acoso", label: "Acoso", icon: Users, color: "purple" },
  { key: "accidente", label: "Accidente", icon: Car, color: "green" },
  { key: "zonaOscura", label: "Zona oscura", icon: Moon, color: "gray" },
];

function Alerts() {
  const navigate = useNavigate();

  const [radius, setRadius] = useState(5);
  const [riskLevel, setRiskLevel] = useState("alto");
  const [savedMessage, setSavedMessage] = useState(false);

  const [types, setTypes] = useState({
    robo: true,
    acoso: true,
    accidente: true,
    zonaOscura: false,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("callego_alerts_settings"));

    if (saved) {
      setRadius(saved.radius || 5);
      setRiskLevel(saved.riskLevel || "alto");
      setTypes(saved.types || types);
    }
  }, []);

  const toggleType = (key) => {
    setTypes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = () => {
    localStorage.setItem(
      "callego_alerts_settings",
      JSON.stringify({ radius, riskLevel, types }),
    );

    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
      navigate(-1);
    }, 1200);
  };

  return (
    <main className="screen alerts-screen">
      <header className="alerts-header">
        <button type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Alertas de Proximidad</h1>
        <p>Personaliza qué avisos quieres recibir cerca de tu ubicación.</p>
      </header>

      <section className="alerts-card">
        <div className="radius-top">
          <div>
            <h3>Distancia máxima de alerta</h3>
            <p>Recibirás avisos dentro de este rango.</p>
          </div>

          <span>{radius} km</span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />

        <div className="radius-labels">
          <span>1 km</span>
          <span>5 km</span>
          <span>10 km</span>
        </div>
      </section>

      <section className="alerts-card incident-types-card">
        <h4>Tipos de incidente</h4>

        {incidentTypes.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              className={`alert-type-row ${types[item.key] ? "active" : ""}`}
              onClick={() => toggleType(item.key)}
            >
              <span
                className={`check-box ${types[item.key] ? "checked" : ""}`}
              />

              <span className={`type-icon ${item.color}`}>
                <Icon size={19} />
              </span>

              <div>
                <strong>{item.label}</strong>
                <p>
                  {types[item.key]
                    ? "Recibirás este tipo de alerta."
                    : "No recibirás esta alerta."}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      <section className="alerts-card">
        <h4>Nivel mínimo de riesgo</h4>

        <div className="risk-options">
          {["moderado", "alto", "crítico"].map((level) => (
            <button
              key={level}
              type="button"
              className={riskLevel === level ? "selected" : ""}
              onClick={() => setRiskLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      <section className="alert-preview-card">
        <Bell size={20} />

        <div>
          <strong>Vista previa</strong>
          <p>
            Robo reportado a 800 m de tu ubicación. Nivel de riesgo {riskLevel}.
          </p>
        </div>
      </section>

      {savedMessage && (
        <div className="alerts-saved-message">
          <ShieldAlert size={18} />
          Configuración guardada
        </div>
      )}

      <button type="button" className="save-alerts-btn" onClick={saveSettings}>
        Guardar configuración
      </button>
    </main>
  );
}

export default Alerts;
