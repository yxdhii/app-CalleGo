import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MailCheck, RefreshCcw } from "lucide-react";

function RecoverySent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("recovery_email") || "tu correo");
  }, []);

  return (
    <main className="screen recovery-screen">
      <button className="back-button" onClick={() => navigate("/forgot-password")}>
        <ChevronLeft size={24} />
        Volver
      </button>

      <section className="recovery-content">
        <div className="recovery-icon">
          <MailCheck size={50} />
        </div>

        <h1>Revisa tu correo</h1>

        <p className="recovery-description">
          Hemos enviado un enlace para restablecer tu contraseña a:
        </p>

        <div className="recovery-email-card">{email}</div>

        <div className="recovery-message-card">
          <p>
            El enlace expirará en <b>15 minutos</b>. Revisa tu bandeja de entrada
            y también la carpeta de spam.
          </p>
        </div>

        <button
          className="recovery-main-btn"
          onClick={() => navigate("/reset-password")}
        >
          Crear nueva contraseña
        </button>

        <button
          className="recovery-secondary-btn"
          onClick={() => navigate("/forgot-password")}
        >
          <RefreshCcw size={18} />
          Usar otro correo
        </button>
      </section>
    </main>
  );
}

export default RecoverySent;