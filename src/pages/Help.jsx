import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Mail, Globe, X } from "lucide-react";

const faqs = [
  {
    question: "¿Cómo reporto un incidente?",
    answer:
      "Presiona el botón Reportar, selecciona el tipo de incidente, agrega una descripción opcional, confirma la ubicación y envía el reporte.",
  },
  {
    question: "¿Qué significa cada color del mapa?",
    answer:
      "Verde significa zona segura, amarillo riesgo moderado, naranja riesgo alto y rojo riesgo crítico según los reportes ciudadanos.",
  },
  {
    question: "¿Cómo funciona el sistema de puntos?",
    answer:
      "Ganas puntos por reportes enviados y validados. Si un reporte resulta falso, la reputación puede disminuir.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "CalleGo permite reportes anónimos y protege tus datos de ubicación según las opciones de privacidad configuradas.",
  },
  {
    question: "¿Cómo elimino mi cuenta?",
    answer:
      "Puedes eliminar tu cuenta desde Privacidad. Antes de hacerlo, CalleGo mostrará una confirmación para evitar errores.",
  },
];

function Help() {
  const navigate = useNavigate();
  const [selectedFaq, setSelectedFaq] = useState(null);

  return (
    <main className="screen help-screen">
      <header className="help-header">
        <button type="button" onClick={() => navigate("/profile")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Ayuda</h1>
        <p>Encuentra respuestas rápidas sobre el uso de CalleGo.</p>
      </header>

      <section className="help-card">
        <h3>Preguntas frecuentes</h3>

        {faqs.map((faq) => (
          <button
            key={faq.question}
            className="help-item"
            onClick={() => setSelectedFaq(faq)}
          >
            <span>{faq.question}</span>
            <ChevronRight size={18} />
          </button>
        ))}
      </section>

      <section className="help-card">
        <h3>Contacto</h3>

        <button className="help-item">
          <div className="help-contact-icon blue">
            <Mail size={18} />
          </div>
          <span>soporte@callego.app</span>
          <ChevronRight size={18} />
        </button>

        <button className="help-item">
          <div className="help-contact-icon green">
            <Globe size={18} />
          </div>
          <span>www.callego.app</span>
          <ChevronRight size={18} />
        </button>
      </section>

      {selectedFaq && (
        <div className="faq-modal-overlay" onClick={() => setSelectedFaq(null)}>
          <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="faq-close-icon"
              onClick={() => setSelectedFaq(null)}
            >
              <X size={18} />
            </button>

            <h3>{selectedFaq.question}</h3>
            <p>{selectedFaq.answer}</p>

            <button
              className="faq-close-btn"
              onClick={() => setSelectedFaq(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Help;
