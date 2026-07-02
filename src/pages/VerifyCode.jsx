import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import logo from "../assets/logo-callego.png";

function VerifyCode() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const correctCode = "123456";

  useEffect(() => {
    setEmail(localStorage.getItem("recovery_email") || "tu correo");
  }, []);

  const hideEmail = (emailValue) => {
    if (!emailValue.includes("@")) return emailValue;

    const [name, domain] = emailValue.split("@");
    return `${name.slice(0, 3)}***@${domain}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join("");

    if (enteredCode.length < 6) {
      setError("Ingresa el código de 6 dígitos.");
      return;
    }

    if (enteredCode !== correctCode) {
      setError("Código incorrecto. Usa 123456 para este prototipo.");
      return;
    }

    setShowSuccess(true);

    setTimeout(() => {
      navigate("/reset-password");
    }, 1100);
  };

  const handleResend = () => {
    setCode(["", "", "", "", "", ""]);
    setError("Código reenviado. Usa 123456 para continuar.");
    inputRefs.current[0].focus();
  };

  return (
    <main className="screen verify-screen">
      <button
        className="verify-back"
        onClick={() => navigate("/forgot-password")}
      >
        <ArrowLeft size={22} />
        Volver
      </button>

      <section className="verify-content">
        <img src={logo} alt="CalleGo" className="verify-logo" />

        <h1>Verificar código</h1>

        <p className="verify-description">
          Hemos enviado un código de 6 dígitos a tu correo electrónico.
        </p>

        <div className="verify-email-card">{hideEmail(email)}</div>

        <label>Código de verificación</label>

        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {error && <span className="verify-error">{error}</span>}

        <button className="verify-main-btn" onClick={handleVerify}>
          Verificar código
        </button>

        <button className="verify-resend-btn" onClick={handleResend}>
          <RefreshCcw size={17} />
          Reenviar código
        </button>

        <div className="verify-divider">
          <span></span>
          <p>o</p>
          <span></span>
        </div>

        <button
          className="verify-login-link"
          onClick={() => navigate("/login")}
        >
          Volver al inicio de sesión
        </button>
      </section>
      {showSuccess && (
        <div className="verify-modal-overlay">
          <div className="verify-modal">
            <div className="verify-modal-icon">✓</div>
            <h3>Código verificado</h3>
          </div>
        </div>
      )}
    </main>
  );
}

export default VerifyCode;
