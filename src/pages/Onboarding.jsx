import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, MapPin, Bell, ArrowRight } from "lucide-react";

const slides = [
  {
    icon: <Shield size={58} />,
    title: "Muévete más seguro con CalleGo",
    text: "Mapas de riesgo en tiempo real basados en reportes ciudadanos verificados. Conoce las zonas antes de llegar.",
  },
  {
    icon: <MapPin size={58} />,
    title: "Elige la ruta que más te conviene",
    text: "Compara rutas seguras vs rápidas con score de riesgo. Tú decides cómo quieres llegar.",
  },
  {
    icon: <Bell size={58} />,
    title: "Alertas antes de llegar",
    text: "Recibe notificaciones automáticas al acercarte a zonas con reportes recientes. Siempre un paso adelante.",
  },
];

function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="screen onboarding">
      <button className="skip" onClick={() => navigate("/login")}>
        Saltar
      </button>

      <section className="onboarding-content">
        <div className="circle-icon">{slide.icon}</div>

        <h2>{slide.title}</h2>
        <p>{slide.text}</p>
      </section>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? "active" : ""}
          ></span>
        ))}
      </div>

      <button className="next-button" onClick={nextSlide}>
        {current === slides.length - 1 ? "Empezar" : "Siguiente"}
        <ArrowRight size={28} />
      </button>

      <div className="home-indicator"></div>
    </main>
  );
}

export default Onboarding;
