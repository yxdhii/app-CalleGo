import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo-callego.png";
import AuthInput from "../components/AuthInput";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const savedEmail = localStorage.getItem("user_email");
    const savedPassword = localStorage.getItem("user_password");

    if (!savedEmail) {
      setError("No hay una cuenta registrada. Regístrate primero.");
      return;
    }

    if (email.trim() !== savedEmail || password !== savedPassword) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setError("");
    localStorage.setItem("isLoggedIn", "true");
    navigate("/heatmap");
  };

  return (
    <main className="screen auth-screen">
      <section className="login-logo-section">
        <img src={logo} alt="CalleGo" className="auth-logo" />
        <h1>Bienvenido a CalleGo</h1>
        <p>Inicia sesión para continuar</p>
      </section>

      <section className="auth-actions">
        <button className="social-btn google">
          <FcGoogle size={22} />
          Continuar con Google
        </button>
        <button className="social-btn apple">
          <FaApple size={22} />
          Continuar con Apple
        </button>

        <div className="separator">
          <span></span>
          <p>o</p>
          <span></span>
        </div>

        <AuthInput
          icon={<Mail size={18} />}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          icon={<Lock size={18} />}
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightIcon={
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "-6px" }}>
            {error}
          </p>
        )}

        <p className="forgot">¿Olvidaste tu contraseña?</p>
        <button className="main-auth-btn" onClick={handleLogin}>
          Iniciar sesión
        </button>

        <p className="auth-link">
          ¿No tienes cuenta?
          <b onClick={() => navigate("/register")}> Regístrate</b>
        </p>
      </section>

      <div className="home-indicator"></div>
    </main>
  );
}

export default Login;
