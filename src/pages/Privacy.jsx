import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  EyeOff,
  Lock,
  FileText,
  Download,
  Trash2,
  ShieldCheck,
} from "lucide-react";

function Privacy() {
  const navigate = useNavigate();

  const [shareLocation, setShareLocation] = useState(true);
  const [anonymousDefault, setAnonymousDefault] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const savedLocation = JSON.parse(
      localStorage.getItem("callego_share_location"),
    );

    const savedAnonymous = JSON.parse(
      localStorage.getItem("callego_anonymous_default"),
    );

    if (savedLocation !== null) setShareLocation(savedLocation);
    if (savedAnonymous !== null) setAnonymousDefault(savedAnonymous);
  }, []);

  return (
    <main className="screen privacy-screen">
      <header className="privacy-header">
        <button type="button" onClick={() => navigate("/profile")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Privacidad</h1>
        <p>Controla tu ubicación, anonimato y seguridad de cuenta.</p>
      </header>

      <section className="privacy-card">
        <h3>Datos y ubicación</h3>

        <div className="privacy-row">
          <div className="privacy-icon blue">
            <MapPin size={20} />
          </div>

          <div>
            <h4>Compartir ubicación</h4>
            <p>Permite calcular rutas seguras y alertas cercanas.</p>
          </div>

          <button
            className={`privacy-switch ${shareLocation ? "active" : ""}`}
            onClick={() => {
              const value = !shareLocation;
              setShareLocation(value);
              localStorage.setItem(
                "callego_share_location",
                JSON.stringify(value),
              );
            }}
          >
            <span></span>
          </button>
        </div>

        <div className="privacy-row">
          <div className="privacy-icon purple">
            <EyeOff size={20} />
          </div>

          <div>
            <h4>Reportes anónimos</h4>
            <p>Usar anonimato como opción predeterminada.</p>
          </div>

          <button
            className={`privacy-switch ${anonymousDefault ? "active" : ""}`}
            onClick={() => {
              const value = !anonymousDefault;
              setAnonymousDefault(value);
              localStorage.setItem(
                "callego_anonymous_default",
                JSON.stringify(value),
              );
            }}
          >
            <span></span>
          </button>
        </div>
      </section>

      <section className="privacy-card">
        <h3>Seguridad de la cuenta</h3>

        <button
          className="privacy-link"
          onClick={() => navigate("/change-password")}
        >
          <div className="privacy-icon red">
            <Lock size={20} />
          </div>

          <div className="privacy-link-content">
            <h4>Cambiar contraseña</h4>
            <p>Actualiza tu clave de acceso.</p>
          </div>

          <span>›</span>
        </button>
      </section>

      <section className="privacy-card">
        <h3>Legal</h3>

        <button className="privacy-link" onClick={() => navigate("/privacy-policy")}>
          <FileText size={20} />
          Política de privacidad
          <span>›</span>
        </button>

        <button className="privacy-link" onClick={() => navigate("/terms")}>
          <ShieldCheck size={20} />
          Términos de uso
          <span>›</span>
        </button>

        <button className="privacy-link" onClick={() => navigate("/data-protection-law")}>
          <FileText size={20} />
          Ley N.º 29733 - Protección de datos
          <span>›</span>
        </button>
      </section>

      <section className="privacy-card">
        <h3>Gestión de datos</h3>

        <button className="privacy-link">
          <Download size={20} />
          Descargar mis datos
          <span>›</span>
        </button>
      </section>

      <button
        className="delete-account-btn"
        onClick={() => setShowDeleteModal(true)}
      >
        <Trash2 size={18} />
        Eliminar cuenta
      </button>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Eliminar cuenta</h3>

            <p>¿Estás seguro de que deseas eliminar tu cuenta?</p>

            <small>Esta acción eliminará tus datos y reportes.</small>

            <div className="delete-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home-indicator"></div>
    </main>
  );
}

export default Privacy;
