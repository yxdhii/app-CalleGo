import { ChevronLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TermsOfUse() {
  const navigate = useNavigate();

  return (
    <div className="legal-screen screen">
      <button className="legal-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Volver
      </button>

      <div className="legal-icon">
        <FileText size={30} />
      </div>

      <h1>Términos de uso</h1>
      <p>
        Al utilizar CalleGo, el usuario acepta hacer un uso responsable de la
        plataforma y de sus funciones de seguridad ciudadana.
      </p>

      <section>
        <h3>Uso correcto</h3>
        <p>
          El usuario debe registrar reportes reales, respetuosos y relacionados
          con situaciones de seguridad urbana.
        </p>
      </section>

      <section>
        <h3>Reportes falsos</h3>
        <p>
          Los reportes falsos pueden afectar la reputación del usuario y limitar
          el uso de algunas funciones.
        </p>
      </section>

      <section>
        <h3>Responsabilidad</h3>
        <p>
          CalleGo brinda información de apoyo, pero no reemplaza a las
          autoridades ni garantiza la ausencia total de riesgo.
        </p>
      </section>
    </div>
  );
}

export default TermsOfUse;
