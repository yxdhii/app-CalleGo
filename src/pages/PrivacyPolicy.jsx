import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-screen screen">
      <button className="legal-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Volver
      </button>

      <div className="legal-icon">
        <ShieldCheck size={30} />
      </div>

      <h1>Política de privacidad</h1>
      <p>
        CalleGo protege la información personal de sus usuarios conforme a la
        Ley N.º 29733 - Ley de Protección de Datos Personales.
      </p>

      <section>
        <h3>Datos recopilados</h3>
        <p>
          Nombre, correo, teléfono, ubicación aproximada y reportes enviados.
        </p>
      </section>

      <section>
        <h3>Uso de la información</h3>
        <p>
          Los datos se utilizan para mostrar zonas de riesgo, alertas cercanas,
          rutas seguras y mejorar la experiencia del usuario.
        </p>
      </section>

      <section>
        <h3>Ubicación GPS</h3>
        <p>
          La ubicación solo se usa mientras la app está activa para calcular
          alertas y sugerir rutas más seguras.
        </p>
      </section>

      <section>
        <h3>Seguridad</h3>
        <p>
          CalleGo busca proteger la información y evitar el uso indebido de los
          datos personales.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
