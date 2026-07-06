import { ChevronLeft, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DataProtectionLaw() {
  const navigate = useNavigate();

  return (
    <div className="legal-screen screen">
      <button className="legal-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Volver
      </button>

      <div className="legal-icon"><Scale size={30} /></div>

      <h1>Ley N.º 29733</h1>
      <p>
        La Ley N.º 29733 protege los datos personales en el Perú y regula el uso,
        almacenamiento y tratamiento de la información de los usuarios.
      </p>

      <section>
        <h3>Aplicación en CalleGo</h3>
        <p>
          CalleGo considera esta ley para proteger datos como el nombre, correo,
          teléfono, ubicación y reportes generados dentro de la aplicación.
        </p>
      </section>

      <section>
        <h3>Derechos del usuario</h3>
        <p>
          El usuario puede solicitar información sobre el uso de sus datos,
          actualización, cancelación u oposición al tratamiento de los mismos.
        </p>
      </section>

      <button
        className="legal-main-btn"
        onClick={() =>
          window.open("https://cdn.www.gob.pe/uploads/document/file/272360/Ley%20N%C2%BA%2029733.pdf.pdf?v=1618338779", "_blank")
        }
      >
        Ver ley completa
      </button>
    </div>
  );
}

export default DataProtectionLaw;