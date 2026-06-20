import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const savedPassword = localStorage.getItem("user_password");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Completa todos los campos");
      return;
    }

    if (currentPassword !== savedPassword) {
      setErrorMessage("La contraseña actual es incorrecta");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setErrorMessage("");

    localStorage.setItem("user_password", newPassword);

    setSaved(true);

    setTimeout(() => {
      navigate("/privacy");
    }, 1500);
  };

  return (
    <main className="screen change-password-screen">
      <header className="change-password-header">
        <button type="button" onClick={() => navigate("/privacy")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Cambiar contraseña</h1>

        <p>Actualiza tu clave de acceso para proteger tu cuenta.</p>
      </header>

      <section className="change-password-card">
        <div className="password-input-group">
          <label>Contraseña actual</label>

          <div className="password-input">
            <Lock size={18} />

            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
            />

            <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="password-input-group">
          <label>Nueva contraseña</label>

          <div className="password-input">
            <Lock size={18} />

            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />

            <button type="button" onClick={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="password-input-group">
          <label>Confirmar contraseña</label>

          <div className="password-input">
            <Lock size={18} />

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu contraseña"
            />

            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </section>

      <button className="save-password-btn" onClick={handleSave}>
        Guardar cambios
      </button>

      {errorMessage && (
        <div className="password-error-toast">{errorMessage}</div>
      )}

      {saved && (
        <div className="password-toast">
          <CheckCircle2 size={18} />
          Contraseña actualizada correctamente
        </div>
      )}
    </main>
  );
}

export default ChangePassword;
