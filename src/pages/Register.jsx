import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import AuthInput from "../components/AuthInput";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!acceptedTerms || !name.trim() || !email.trim()) return;

    // Limpia cualquier dato de una cuenta anterior antes de crear la nueva
    localStorage.removeItem("user_photo");
    localStorage.removeItem("callego_reports");

    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_password", password);
    localStorage.setItem(
      "user_initials",
      name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    );
    localStorage.setItem("callego_points", "0");

    navigate("/success");
  };

  return (
    <main className="screen register-screen">
      <button className="back-button" onClick={() => navigate("/login")}>
        <ChevronLeft size={24} />
        Volver
      </button>

      <section className="register-header">
        <h1>Crea tu cuenta en CalleGo</h1>
        <p>Regístrate para moverte más seguro</p>
      </section>

      <section className="register-form">
        <AuthInput
          icon={<User size={18} />}
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        <div className="phone-input">
          <span>
            PE&nbsp; <b>+51</b>
          </span>
          <div className="phone-line"></div>
          <input type="text" placeholder="Número de teléfono" />
          <button>NUEVO</button>
        </div>

        <div className="terms-box">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(!acceptedTerms)}
          />
          <p>
            Acepto los <b>términos de uso</b> y la <b>política de privacidad</b>{" "}
            conforme a la <u>Ley N° 29733</u> de Protección de Datos Personales
            del Perú.
            <small>Tu ubicación solo se usa mientras la app está activa.</small>
          </p>
        </div>

        <button
          className={acceptedTerms ? "register-active" : "register-disabled"}
          onClick={handleRegister}
        >
          Registrarse
        </button>

        <div className="separator register-separator">
          <span></span>
          <p>o</p>
          <span></span>
        </div>

        <button className="social-btn google">
          <FcGoogle size={22} />
          Continuar con Google
        </button>

        <button className="social-btn apple">
          <FaApple size={22} />
          Continuar con Apple
        </button>

        <p className="auth-link register-login">
          ¿Ya tienes cuenta?
          <b onClick={() => navigate("/login")}> Inicia sesión</b>
        </p>
      </section>

      <div className="home-indicator"></div>
    </main>
  );
}

export default Register;
