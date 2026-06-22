import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import calleGoLogo from "../assets/logo-callego.png";
import wallpaper from "../assets/iphone-wallpaper.jpg";
import wallpaper1 from "../assets/wallpaper-1.jpg";
import wallpaper2 from "../assets/wallpaper-2.jpg";
import wallpaper3 from "../assets/wallpaper-3.jpg";
import wallpaper4 from "../assets/wallpaper-4.jpg";

import calculatorIcon from "../assets/ios-icons/calculator.png";
import remindersIcon from "../assets/ios-icons/reminders.png";
import notesIcon from "../assets/ios-icons/notes.png";
import mapsIcon from "../assets/ios-icons/map.png";
import settingsIcon from "../assets/ios-icons/settings.png";
import mailIcon from "../assets/ios-icons/mail.webp";
import facetimeIcon from "../assets/ios-icons/facetime.webp";
import clockIcon from "../assets/ios-icons/clock.webp";
import musicIcon from "../assets/ios-icons/music.webp";
import messagesIcon from "../assets/ios-icons/messages.webp";
import callsIcon from "../assets/ios-icons/calls.png";

const apps = [
  { name: "Calculadora", icon: calculatorIcon },
  { name: "Recordatorios", icon: remindersIcon },
  { name: "Notas", icon: notesIcon },
  { name: "Mapas", icon: mapsIcon },
  { name: "Ajustes", icon: settingsIcon },
  { name: "Correo", icon: mailIcon },
  { name: "FaceTime", icon: facetimeIcon },
  { name: "Reloj", icon: clockIcon },
  { name: "Música", icon: musicIcon },
  { name: "Mensajes", icon: messagesIcon },
];

const dockApps = [
  { name: "Teléfono", icon: callsIcon },
  { name: "Mensajes", icon: messagesIcon },
  { name: "Mapas", icon: mapsIcon },
  { name: "Música", icon: musicIcon },
];

const deleteReasons = [
  "Las rutas no fueron útiles",
  "Recibí demasiadas alertas",
  "No encontré reportes en mi zona",
  "La aplicación es difícil de usar",
  "No confío en la información",
  "Solo estaba probando la app",
  "Otro motivo",
];

function HomeScreen() {
  const navigate = useNavigate();
  const iconRef = useRef(null);
  const screenRef = useRef(null);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [showDeleteFeedback, setShowDeleteFeedback] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [appRemoved, setAppRemoved] = useState(false);
  const [thanksMessage, setThanksMessage] = useState(false);

  const [launching, setLaunching] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const launchCalleGo = () => {
    if (launching) return;

    setLaunching(true);

    const iconRect = iconRef.current.getBoundingClientRect();
    const screenRect = screenRef.current.getBoundingClientRect();

    const x = iconRect.left - screenRect.left + iconRect.width / 2;
    const y = iconRect.top - screenRect.top + iconRect.height / 2;

    setOverlayStyle({
      left: x,
      top: y,
      width: 0,
      height: 0,
      opacity: 1,
    });

    requestAnimationFrame(() => {
      setOverlayStyle({
        left: x,
        top: y,
        width: 900,
        height: 900,
        opacity: 1,
      });
    });

    setTimeout(() => {
      navigate("/splash");
    }, 520);
  };

  return (
    <main
      className="screen home-screen"
      ref={screenRef}
      style={{ backgroundImage: `url(${wallpaper1})` }}
    >
      <section className="home-app-grid">
        {apps.map((app) => (
          <div className="home-app-icon" key={app.name}>
            <div className="home-app-tile">
              <img src={app.icon} alt={app.name} />
            </div>

            <span>{app.name}</span>
          </div>
        ))}

        {!appRemoved && (
          <div
            className="home-app-icon"
            ref={iconRef}
            onClick={launchCalleGo}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowAppMenu(true);
            }}
          >
            <div className="home-app-tile callego-tile">
              <img
                src={calleGoLogo}
                alt="CalleGo"
                className="callego-logo-img"
              />
            </div>
            <span>CalleGo</span>
          </div>
        )}
      </section>

      <section className="home-dock">
        {dockApps.map((app) => (
          <div className="home-dock-icon" key={app.name}>
            <img src={app.icon} alt={app.name} />
          </div>
        ))}
      </section>

      {showAppMenu && (
        <div className="app-delete-menu">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAppMenu(false);
              setShowDeleteFeedback(true);
            }}
          >
            Eliminar app
          </button>

          <button type="button" onClick={() => setShowAppMenu(false)}>
            Cancelar
          </button>
        </div>
      )}

      {showDeleteFeedback && (
        <div className="delete-feedback-overlay">
          <div className="delete-feedback-modal">
            <h3>Eliminar CalleGo</h3>
            <p>Antes de irte, cuéntanos qué podríamos mejorar.</p>

            <div className="delete-reasons">
              {deleteReasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  className={selectedReason === reason ? "selected" : ""}
                  onClick={() => setSelectedReason(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="send-delete-feedback"
              disabled={!selectedReason}
              onClick={() => {
                localStorage.setItem("callego_delete_reason", selectedReason);
                setShowDeleteFeedback(false);
                setAppRemoved(true);
                setThanksMessage(true);

                setTimeout(() => {
                  setThanksMessage(false);
                }, 2200);
              }}
            >
              Enviar comentarios
            </button>

            <button
              type="button"
              className="cancel-delete-feedback"
              onClick={() => {
                setShowDeleteFeedback(false);
                setSelectedReason("");
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {thanksMessage && (
        <div className="delete-thanks-toast">
          Gracias por ayudarnos a mejorar CalleGo 💙
        </div>
      )}

      <div
        className="home-launch-overlay"
        style={{
          left: overlayStyle.left,
          top: overlayStyle.top,
          width: overlayStyle.width,
          height: overlayStyle.height,
          opacity: overlayStyle.opacity,
        }}
      />
    </main>
  );
}

export default HomeScreen;
