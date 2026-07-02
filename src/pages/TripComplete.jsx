import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";

function TripComplete() {
  const navigate = useNavigate();
  const location = useLocation();

  const [rating, setRating] = useState(0);
  const [showThanks, setShowThanks] = useState(false);

  const distanceKm = Number(location.state?.distanceKm || 2.4);
  const durationMin = Number(location.state?.durationMin || 0);

  useEffect(() => {
    const trips = Number(localStorage.getItem("callego_trips") || 0);
    const km = Number(localStorage.getItem("callego_km") || 0);

    localStorage.setItem("callego_trips", String(trips + 1));
    localStorage.setItem("callego_km", String((km + distanceKm).toFixed(1)));
  }, [distanceKm]);

  const saveRating = (value) => {
    if (showThanks) return;

    setRating(value);
    setShowThanks(true);

    const ratingCount = Number(
      localStorage.getItem("callego_rating_count") || 0,
    );
    const ratingTotal = Number(
      localStorage.getItem("callego_rating_total") || 0,
    );

    localStorage.setItem("callego_rating_count", String(ratingCount + 1));
    localStorage.setItem("callego_rating_total", String(ratingTotal + value));

    setTimeout(() => {
      navigate("/heatmap");
    }, 1200);
  };

  return (
    <main className="screen trip-complete-screen">
      <div className="trip-dots"></div>
      <div className="trip-ring"></div>

      <section className="trip-complete-content">
        <div className="trip-check-area">
          <div className="trip-pulse pulse-one"></div>
          <div className="trip-pulse pulse-two"></div>

          <div className="trip-success-icon">
            <Check size={58} strokeWidth={4.4} color="#10C978" />
          </div>
        </div>

        <h1>Trayecto completado</h1>

        <p className="trip-subtitle">
          Llegaste a tu destino usando una ruta segura.
        </p>

        <section className="trip-summary-card">
          <div className="trip-summary-item">
            <div className="trip-icon green">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3>Ruta segura completada</h3>
              <p>Finalizaste tu recorrido correctamente.</p>
            </div>
          </div>

          <div className="trip-divider"></div>

          <div className="trip-summary-item">
            <div className="trip-icon blue">
              <MapPin size={28} />
            </div>
            <div>
              <h3>{distanceKm.toFixed(1)} km recorridos</h3>
              <p>
                {durationMin > 0
                  ? `Trayecto de ${Math.round(durationMin)} min registrado.`
                  : "Trayecto finalizado correctamente."}
              </p>
            </div>
          </div>

          <div className="trip-divider"></div>

          <div className="trip-summary-item">
            <div className="trip-icon purple">
              <Sparkles size={28} />
            </div>
            <div>
              <h3>Gracias por contribuir</h3>
              <p>Tu experiencia ayuda a mejorar CalleGo.</p>
            </div>
          </div>
        </section>

        <section className="trip-rating-card">
          <h3>¿Te sentiste segura durante el trayecto?</h3>

          <div className="trip-stars">
            {[1, 2, 3, 4, 5].map((item) => (
              <button
                key={item}
                type="button"
                disabled={showThanks}
                onClick={() => saveRating(item)}
                className={rating >= item ? "active" : ""}
              >
                <Star
                  size={30}
                  fill={rating >= item ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </section>
      </section>

      {showThanks && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <div className="rating-modal-icon">
              <Check size={30} strokeWidth={4} />
            </div>
            <h3>Gracias por valorar tu experiencia</h3>
          </div>
        </div>
      )}

      <div className="trip-wave wave-one"></div>
      <div className="trip-wave wave-two"></div>
      <div className="trip-map-line"></div>
    </main>
  );
}

export default TripComplete;
