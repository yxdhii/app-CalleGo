import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  AlertTriangle,
  Eye,
  Car,
  Moon,
  HelpCircle,
  MapPin,
  Send,
  Camera,
  ImagePlus,
  X,
  User,
  UserRoundX,
} from "lucide-react";

const incidents = [
  { id: "robo", label: "Robo", icon: AlertTriangle, color: "red" },
  { id: "acoso", label: "Acoso", icon: Eye, color: "orange" },
  { id: "accidente", label: "Accidente", icon: Car, color: "yellow" },
  { id: "oscura", label: "Zona oscura", icon: Moon, color: "gray" },
  { id: "otros", label: "Otros", icon: HelpCircle, color: "blue" },
];

function ReportIncident() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState("robo");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const [showDescriptionPanel, setShowDescriptionPanel] = useState(false);
  const [showGpsInfo, setShowGpsInfo] = useState(false);

  const [gpsAddress, setGpsAddress] = useState("Av. Las Flores, SJL");
  const [gpsStatus, setGpsStatus] = useState("Detectando ubicación...");
  const [gpsCoords, setGpsCoords] = useState(null);

  const handlePhoto = (file) => {
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoPreview("");
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("Tu dispositivo no soporta geolocalización");
      return;
    }

    setGpsStatus("Actualizando ubicación...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);
        setGpsCoords([lat, lon]);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );

          const data = await response.json();

          setGpsAddress(
            data.address?.road ||
              data.display_name ||
              `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
          );

          setGpsStatus(`GPS actualizado · Precisión ±${accuracy}m`);
        } catch {
          setGpsAddress(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          setGpsStatus(`GPS actualizado · Precisión ±${accuracy}m`);
        }
      },
      () => {
        setGpsStatus("Permiso de ubicación denegado o no disponible");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    updateLocation();
  }, []);

  const getReportDate = () => {
    const now = new Date();

    return now.toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendReport = () => {
    const fallbackCoords = [-12.0297, -77.0107];
    const newReport = {
      id: Date.now(),
      type: selected,
      description,
      location: gpsAddress,
      reporter: anonymous
        ? "Ciudadano anónimo"
        : localStorage.getItem("user_name") || "Usuario CalleGo",
      anonymous,
      photo: photoPreview,
      date: getReportDate(),
      createdAt: new Date().toISOString(),
      status: "En revisión",
      points: 0,
      reactions: { useful: 0, surprised: 0, alert: 0 },
    };

    const reports = JSON.parse(localStorage.getItem("callego_reports")) || [];
    localStorage.setItem(
      "callego_reports",
      JSON.stringify([newReport, ...reports]),
    );

    /*const currentPoints = Number(localStorage.getItem("callego_points")) || 320;
    localStorage.setItem("callego_points", currentPoints + 5);*/

    navigate("/report-success");
    {
      state: {
        report: newReport;
      }
    }
  };

  return (
    <main className="screen report-screen">
      <header className="report-header">
        <button type="button" onClick={() => navigate("/heatmap")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Reportar incidente</h1>
        <p>Completado en menos de 15 segundos</p>
      </header>

      <section className="gps-pill" onClick={() => setShowGpsInfo(true)}>
        <span></span>
        GPS detectado: {gpsAddress}
        <MapPin size={15} />
      </section>

      <section className="report-section">
        <h3>¿Qué ocurrió?</h3>

        <div className="incident-grid">
          {incidents.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`incident-card ${item.color} ${
                  selected === item.id ? "selected" : ""
                }`}
                onClick={() => setSelected(item.id)}
              >
                <div>
                  <Icon size={20} />
                </div>

                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="report-section">
        <h3>
          Descripción breve <span>(opcional)</span>
        </h3>

        <button
          type="button"
          className="description-preview"
          onClick={() => setShowDescriptionPanel(true)}
        >
          {description || "Ej: Dos personas en moto sin placa"}
        </button>
      </section>

      <section
        className="auto-location-box"
        onClick={() => setShowGpsInfo(true)}
      >
        <div>
          <MapPin size={22} />
        </div>

        <article>
          <h4>Ubicación del incidente</h4>
          <p>
            {gpsAddress} · {gpsStatus}
          </p>
        </article>
      </section>

      <section className="anonymous-row">
        <div>
          <h4>Reportar anónimamente</h4>
          <p>
            {anonymous ? "Tu nombre no será visible" : "Se mostrará tu nombre"}
          </p>
        </div>

        <button
          type="button"
          className={`switch-btn ${anonymous ? "active" : ""}`}
          onClick={() => setAnonymous(!anonymous)}
        >
          <span></span>
        </button>
      </section>

      <button type="button" className="send-report-btn" onClick={sendReport}>
        <Send size={25} />
        Enviar reporte
      </button>

      {showDescriptionPanel && (
        <section className="description-sheet">
          <div className="description-sheet-header">
            <button
              type="button"
              onClick={() => setShowDescriptionPanel(false)}
            >
              <ChevronLeft size={24} />
            </button>

            <h2>Agregar detalles</h2>

            <button
              type="button"
              className="done-detail-btn"
              onClick={() => setShowDescriptionPanel(false)}
            >
              Listo
            </button>
          </div>

          <textarea
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brevemente lo ocurrido..."
          />

          {photoPreview && (
            <div className="description-photo-preview">
              <img src={photoPreview} alt="Evidencia" />

              <button type="button" onClick={removePhoto}>
                <X size={16} />
              </button>
            </div>
          )}

          <div className="detail-options">
            <label>
              <Camera size={22} />
              Cámara
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
            </label>

            <label>
              <ImagePlus size={22} />
              Foto / video
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
            </label>

            <button type="button" onClick={() => setShowGpsInfo(true)}>
              <MapPin size={22} />
              Confirmar ubicación
            </button>
          </div>

          <div className="sheet-home-indicator"></div>
        </section>
      )}

      {showGpsInfo && (
        <section className="gps-sheet">
          <div className="sheet-handle"></div>

          <h2>Ubicación del incidente</h2>

          <div className="gps-detail-card">
            <MapPin size={24} />

            <div>
              <h3>{gpsAddress}</h3>
              <p>{gpsStatus}</p>
              <span>
                Puedes usar tu ubicación actual o cambiarla luego en el mapa.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="update-gps-btn"
            onClick={updateLocation}
          >
            Usar mi ubicación actual
          </button>

          <button type="button" className="close-gps-btn">
            Cambiar ubicación en el mapa
          </button>

          <button
            type="button"
            className="close-gps-btn"
            onClick={() => setShowGpsInfo(false)}
          >
            Cerrar
          </button>
        </section>
      )}

      <div className="home-indicator"></div>
    </main>
  );
}

export default ReportIncident;
