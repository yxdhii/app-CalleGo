import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bell, Check, Route, ShieldCheck } from "lucide-react";

function Success() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fullName = localStorage.getItem("user_name") || "";
    setFirstName(fullName.split(" ")[0] || "Usuario");
  }, []);

  return (
    <main className="screen success-screen">
      <div className="success-dots"></div>
      <div className="success-ring"></div>
      <div className="success-sparkle">✦</div>

      <section className="success-content">
        <div className="success-check-area">
          <div className="success-pulse pulse-one"></div>
          <div className="success-pulse pulse-two"></div>

          <div className="success-check">
            <Check size={58} strokeWidth={4} color="#10C978" />
          </div>
        </div>

        <h1>
          ¡Registro <span>exitoso!</span>
        </h1>

        <p className="success-subtitle">
          Tu cuenta de CalleGo ha sido creada correctamente.
        </p>

        <div className="success-card">
          <div className="success-item">
            <div className="item-icon green">
              <ShieldCheck size={27} />
            </div>
            <div>
              <h3>Ya formas parte</h3>
              <p>de una comunidad que hace la ciudad un lugar más seguro.</p>
            </div>
          </div>

          <div className="success-divider"></div>

          <div className="success-item">
            <div className="item-icon blue">
              <Bell size={27} />
            </div>
            <div>
              <h3>Mantente alerta</h3>
              <p>y recibe notificaciones en tiempo real.</p>
            </div>
          </div>

          <div className="success-divider"></div>

          <div className="success-item">
            <div className="item-icon purple">
              <Route size={27} />
            </div>
            <div>
              <h3>Muévete con confianza</h3>
              <p>usando rutas más seguras e informadas.</p>
            </div>
          </div>
        </div>

        <button
          className="success-main-btn"
          onClick={() => navigate("/heatmap")}
        >
          Comenzar ahora
          <ArrowRight size={30} />
        </button>
      </section>

      <div className="success-skyline"></div>
      <div className="success-wave wave-one"></div>
      <div className="success-wave wave-two"></div>
      <div className="success-map-line"></div>
    </main>
  );
}

export default Success;
