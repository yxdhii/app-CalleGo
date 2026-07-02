import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowLeft, Mail, Info } from "lucide-react";
import logo from "../assets/logo-callego.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSendLink = () => {
    const savedEmail = localStorage.getItem("user_email");

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Ingresa un correo válido.");
      return;
    }

    if (!savedEmail) {
      setError("No hay una cuenta registrada. Regístrate primero.");
      return;
    }

    if (email.trim().toLowerCase() !== savedEmail.toLowerCase()) {
      setError("No existe una cuenta registrada con este correo.");
      return;
    }

    localStorage.setItem("recovery_email", email.trim());
    localStorage.setItem("verification_code", "123456");

    navigate("/verify-code");
  };

  return (
    <main className="screen forgot-screen">
      <button className="back-button" onClick={() => navigate("/login")}>
        <ChevronLeft size={24} />
        Volver
      </button>

      <section className="forgot-content">
        <img src={logo} alt="CalleGo" className="forgot-logo" />

        <h1>¿Olvidaste tu contraseña?</h1>

        <p className="forgot-description">
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un
          código para restablecer tu contraseña.
        </p>

        <label>Correo electrónico</label>

        <div className="forgot-input-box">
          <Mail size={20} />

          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>

        {error && <span className="forgot-error">{error}</span>}

        <div className="forgot-info-card">
          <div className="forgot-info-icon">
            <Info size={24} />
          </div>

          <div>
            <h3>Código de verificación</h3>

            <p>
              Recibirás un código de 6 dígitos en tu correo electrónico. Por tu
              seguridad, el código expirará en 15 minutos.
            </p>
          </div>
        </div>

        <button className="forgot-main-btn" onClick={handleSendLink}>
          Enviar código
        </button>

        <div className="forgot-divider">
          <span></span>
          <p>o</p>
          <span></span>
        </div>

        <button
          className="forgot-login-link"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={18} />
          Volver al inicio de sesión
        </button>
      </section>
    </main>
  );
}

export default ForgotPassword;
