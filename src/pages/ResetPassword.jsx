import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import logo from "../assets/logo-callego.png";

function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const isValid = hasMinLength && hasNumber && hasUppercase && hasSpecial;

  const handleReset = () => {
    if (!isValid) {
      setError("La contraseña no cumple los requisitos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    localStorage.setItem("user_password", password);
    localStorage.removeItem("recovery_email");

    setShowSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 1800);
  };

  return (
    <main className="screen reset-screen">
      <button
        className="reset-back"
        onClick={() => navigate("/forgot-Password")}
      >
        <ArrowLeft size={22} />
        Volver
      </button>

      <section className="reset-content">
        <img src={logo} alt="CalleGo" className="reset-logo" />

        <h1>Crea tu nueva contraseña</h1>

        <p className="reset-description">
          Tu nueva contraseña debe ser distinta a las anteriores.
        </p>

        <label>Nueva contraseña</label>

        <div className="reset-input-box">
          <Lock size={19} />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
          </button>
        </div>

        <div className="password-rules">
          <p className={hasMinLength ? "valid" : ""}>
            <CheckCircle size={15} /> Mínimo 8 caracteres
          </p>
          <p className={hasNumber ? "valid" : ""}>
            <CheckCircle size={15} /> Incluye números
          </p>
          <p className={hasUppercase ? "valid" : ""}>
            <CheckCircle size={15} /> Incluye mayúsculas
          </p>
          <p className={hasSpecial ? "valid" : ""}>
            <CheckCircle size={15} /> Incluye carácter especial
          </p>
        </div>

        <label>Confirma contraseña</label>

        <div className="reset-input-box">
          <Lock size={19} />

          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Vuelve a escribir tu contraseña"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
          />

          <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <Eye size={19} /> : <EyeOff size={19} />}
          </button>
        </div>

        {error && <span className="reset-error">{error}</span>}

        <button className="reset-main-btn" onClick={handleReset}>
          Restablecer contraseña
        </button>

        <div className="reset-divider">
          <span></span>
          <p>o</p>
          <span></span>
        </div>

        <button className="reset-login-link" onClick={() => navigate("/login")}>
          Volver al inicio de sesión
        </button>
      </section>

      {showSuccess && (
        <div className="reset-success-overlay">
          <div className="reset-success-modal">
            <div className="reset-success-icon">✓</div>

            <h3>¡Contraseña actualizada!</h3>

            <p>
              Tu contraseña se cambió correctamente. Ahora puedes iniciar
              sesión.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default ResetPassword;
