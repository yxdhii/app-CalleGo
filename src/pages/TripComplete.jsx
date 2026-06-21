import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Star } from "lucide-react";

function TripComplete() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("callego_reports")) || [];
    const currentPoints = saved.reduce((sum, r) => sum + (r.points || 0), 0);
    localStorage.setItem("callego_trip_points", String(currentPoints + 2));
  }, []);

  return (
    <main className="screen trip-complete-screen">
      <CheckCircle size={82} />

      <h1>Trayecto completado</h1>
      <p>Llegaste a tu destino usando una ruta segura.</p>

      <section className="trip-points-card">
        <h2>+2 puntos obtenidos</h2>
        <span>Gracias por contribuir a una movilidad más segura.</span>
      </section>

      <section className="trip-rating-card">
        <h3>¿Te sentiste segura durante el trayecto?</h3>

        <div>
          {[1, 2, 3, 4, 5].map((item) => (
            <button
              key={item}
              onClick={() => setRating(item)}
              className={rating >= item ? "active" : ""}
            >
              <Star size={28} />
            </button>
          ))}
        </div>
      </section>

      <button className="back-map-btn" onClick={() => navigate("/heatmap")}>
        Volver al mapa
      </button>

      <div className="home-indicator"></div>
    </main>
  );
}

export default TripComplete;
