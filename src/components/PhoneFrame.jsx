function PhoneFrame({ children }) {
  return (
    <div className="phone-frame-bg">
      <section className="presentation-info">
        <span className="presentation-tag">PROTOTIPO UI/UX</span>

        <h1>
          Calle<span>Go</span>
        </h1>

        <h2>Seguridad colaborativa en tiempo real</h2>

        <div className="presentation-line"></div>

        <p>
          Plataforma inteligente que permite reportar incidentes, visualizar
          zonas de riesgo y encontrar rutas más seguras mediante la
          participación de la comunidad.
        </p>
      </section>

      <div className="phone-frame">
        <div className="phone-notch"></div>

        <div className="phone-statusbar">
          <span className="phone-time">9:41</span>
          <div className="phone-statusbar-icons">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="7" width="3" height="5" rx="0.8" fill="white" />
              <rect x="5" y="5" width="3" height="7" rx="0.8" fill="white" />
              <rect x="10" y="3" width="3" height="9" rx="0.8" fill="white" />
              <rect x="15" y="0" width="3" height="12" rx="0.8" fill="white" />
            </svg>

            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <path
                d="M8.5 9.8a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z"
                fill="white"
              />
              <path
                d="M8.5 6.2c1.5 0 2.9.6 3.9 1.6l-1.4 1.4a3.7 3.7 0 00-5 0L4.6 7.8a5.7 5.7 0 013.9-1.6z"
                fill="white"
              />
              <path
                d="M8.5 2.4c2.6 0 5 1 6.8 2.8l-1.4 1.4a8 8 0 00-10.8 0L1.7 5.2a9.7 9.7 0 016.8-2.8z"
                fill="white"
              />
            </svg>

            <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="22"
                height="12"
                rx="3.5"
                stroke="white"
                strokeOpacity="0.4"
              />
              <rect x="2" y="2" width="19" height="9" rx="2" fill="white" />
              <path
                d="M24 4.5v4a1.5 1.5 0 000-4z"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
          </div>
        </div>

        <div className="phone-screen-content">{children}</div>

        <div className="phone-home-indicator"></div>

        <div className="phone-side-btn phone-btn-mute"></div>
        <div className="phone-side-btn phone-btn-vol-up"></div>
        <div className="phone-side-btn phone-btn-vol-down"></div>
        <div className="phone-side-btn phone-btn-power"></div>
      </div>
    </div>
  );
}

export default PhoneFrame;
