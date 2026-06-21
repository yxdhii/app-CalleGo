import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ZoomControls from "../components/ZoomControls";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import {
  Search,
  User,
  Bell,
  AlertTriangle,
  Navigation,
  PlusCircle,
  Inbox,
  Settings,
  ArrowLeft,
  MapPin,
  Clock,
  X,
  UserCircle2,
  ThumbsUp,
  Eye,
  ShieldAlert,
  Heart,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";

const defaultPosition = [-12.0297, -77.0107];
const demoRiskPoints = [
  {
    id: "demo-1",
    coords: [-12.0297, -77.0107],
    level: "high",
    type: "Robo",
    source: "demo",
  },
  {
    id: "demo-2",
    coords: [-12.0312, -77.0115],
    level: "medium",
    type: "Zona oscura",
    source: "demo",
  },
  {
    id: "demo-3",
    coords: [-12.033, -77.012],
    level: "safe",
    type: "Zona segura",
    source: "demo",
  },
];

const savedPlaces = [
  {
    id: "home",
    name: "Casa",
    address: "Av. Las Flores, SJL",
    lat: -12.0297,
    lon: -77.0107,
  },
  {
    id: "work",
    name: "Trabajo",
    address: "UTP Lima Centro",
    lat: -12.0601,
    lon: -77.0365,
  },
];

function ChangeView({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 16, {
      animate: true,
      duration: 1.5,
    });
  }, [position]);

  return null;
}

function HeatMap() {
  const navigate = useNavigate();
  const [riskPoints, setRiskPoints] = useState(demoRiskPoints);
  const [activeRiskFilter, setActiveRiskFilter] = useState("all");

  const [query, setQuery] = useState("");
  const [position, setPosition] = useState(defaultPosition);
  const [placeName, setPlaceName] = useState("");
  const [showInbox, setShowInbox] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [communityReports, setCommunityReports] = useState([]);
  const [userPhoto, setUserPhoto] = useState(null);
  const [myReactions, setMyReactions] = useState(
    JSON.parse(localStorage.getItem("callego_my_reactions")) || {},
  );

  useEffect(() => {
    const loadReports = () => {
      const savedReports =
        JSON.parse(localStorage.getItem("callego_reports")) || [];
      const reportPoints = savedReports
        .filter((report) => report.coords)
        .map((report) => ({
          id: report.id,
          coords: report.coords,
          level:
            report.type === "robo" || report.type === "acoso"
              ? "high"
              : "medium",
          type: report.type,
          source: "user",
        }));
      setUserPhoto(localStorage.getItem("user_photo"));
      setRiskPoints([...demoRiskPoints, ...reportPoints]);
      setCommunityReports(
        savedReports.map((r) => ({
          ...r,
          reporter: r.anonymous
            ? "Ciudadano anónimo"
            : r.reporter ||
              localStorage.getItem("user_name") ||
              "Usuario CalleGo",
          date:
            r.date ||
            new Date(r.id).toLocaleString("es-PE", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
        })),
      );
    };

    loadReports();
    window.addEventListener("focus", loadReports);
    return () => window.removeEventListener("focus", loadReports);
  }, [showInbox]);

  const handleReaction = (reportId, newType) => {
    const currentType = myReactions[reportId];
    const finalType = currentType === newType ? null : newType;

    const updateReport = (report) => {
      if (report.id !== reportId) return report;

      const reactions = {
        useful: report.reactions?.useful || 0,
        surprised: report.reactions?.surprised || 0,
        alert: report.reactions?.alert || 0,
      };

      if (currentType) {
        reactions[currentType] = Math.max(0, reactions[currentType] - 1);
      }

      if (finalType) {
        reactions[finalType] = reactions[finalType] + 1;
      }

      return {
        ...report,
        reactions,
      };
    };

    const updatedMyReactions = {
      ...myReactions,
      [reportId]: finalType,
    };

    if (!finalType) {
      delete updatedMyReactions[reportId];
    }

    setMyReactions(updatedMyReactions);
    localStorage.setItem(
      "callego_my_reactions",
      JSON.stringify(updatedMyReactions),
    );

    setCommunityReports((prev) => prev.map(updateReport));

    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];

    localStorage.setItem(
      "callego_reports",
      JSON.stringify(savedReports.map(updateReport)),
    );
  };

  const getSuggestions = async (text) => {
    setQuery(text);

    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          text,
        )}&limit=6&lat=-12.0464&lon=-77.0428`,
      );

      const data = await response.json();

      const places = data.features.map((item) => ({
        id:
          item.properties.osm_id ||
          `${item.geometry.coordinates[1]}-${item.geometry.coordinates[0]}`,
        lat: item.geometry.coordinates[1],
        lon: item.geometry.coordinates[0],
        name:
          item.properties.name ||
          item.properties.street ||
          "Lugar seleccionado",
        address: [
          item.properties.street,
          item.properties.city,
          item.properties.country,
        ]
          .filter(Boolean)
          .join(", "),
      }));

      setSuggestions(places);
    } catch (error) {
      console.log("Error buscando sugerencias:", error);
      setSuggestions([]);
    }
  };

  const selectPlace = (place) => {
    const newPosition = [Number(place.lat), Number(place.lon)];

    setPosition(newPosition);
    setPlaceName(place.name);
    setQuery(place.name);
    setSuggestions([]);
    setSearchOpen(false);
  };

  const searchByEnter = () => {
    if (suggestions.length > 0) {
      selectPlace(suggestions[0]);
    }
  };

  const filteredRiskPoints =
    activeRiskFilter === "all"
      ? riskPoints
      : riskPoints.filter((point) => point.level === activeRiskFilter);

  const calculateRiskLevel = (targetCoords) => {
    if (!targetCoords) return { label: "Sin datos", level: "safe" };

    const RADIUS_METERS = 400;

    const getDistanceMeters = (a, b) => {
      const R = 6371000;
      const dLat = ((b[0] - a[0]) * Math.PI) / 180;
      const dLon = ((b[1] - a[1]) * Math.PI) / 180;
      const lat1 = (a[0] * Math.PI) / 180;
      const lat2 = (b[0] * Math.PI) / 180;
      const sinDLat = Math.sin(dLat / 2);
      const sinDLon = Math.sin(dLon / 2);
      const c =
        2 *
        Math.atan2(
          Math.sqrt(
            sinDLat * sinDLat +
              Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
          ),
          Math.sqrt(
            1 -
              (sinDLat * sinDLat +
                Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon),
          ),
        );
      return R * c;
    };

    const nearbyPoints = riskPoints.filter(
      (point) => getDistanceMeters(targetCoords, point.coords) <= RADIUS_METERS,
    );

    const highCount = nearbyPoints.filter((p) => p.level === "high").length;
    const mediumCount = nearbyPoints.filter((p) => p.level === "medium").length;

    if (highCount >= 2) return { label: "IRZ Crítico", level: "critical" };
    if (highCount >= 1) return { label: "IRZ Alto", level: "high" };
    if (mediumCount >= 1) return { label: "IRZ Moderado", level: "medium" };
    return { label: "IRZ Seguro", level: "safe" };
  };

  const currentRisk = calculateRiskLevel(placeName ? position : null);

  return (
    <main className="screen callego-heatmap">
      <MapContainer
        center={position}
        zoom={16}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        className="real-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ChangeView position={position} />
        <ZoomControls />

        <Marker position={position}>
          <Popup>{placeName}</Popup>
        </Marker>

        {filteredRiskPoints.map((point) => {
          const color =
            point.level === "high"
              ? "#ef4444"
              : point.level === "medium"
                ? "#f59e0b"
                : "#22c55e";

          return (
            <>
              <Circle
                key={`glow-${point.id}`}
                center={point.coords}
                radius={45}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.15,
                  opacity: 0,
                  weight: 0,
                }}
              />

              <Circle
                key={point.id}
                center={point.coords}
                radius={15}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 1,
                  opacity: 1,
                  weight: 2,
                }}
              />
            </>
          );
        })}
      </MapContainer>

      <section className="callego-map-top">
        <div className="callego-search" onClick={() => setSearchOpen(true)}>
          <Search size={19} />
          <span>{query || "¿A dónde vas?"}</span>
        </div>

        <button
          type="button"
          className="map-square-btn"
          onClick={() => setShowInbox(true)}
          title="Bandeja de reportes"
        >
          <Inbox size={21} />
          <span className="notification-dot"></span>
        </button>

        <button
          type="button"
          className="map-square-btn profile-map-btn"
          title="Perfil"
          onClick={() => navigate("/profile")}
        >
          {userPhoto ? (
            <img src={userPhoto} alt="Perfil" />
          ) : (
            <User size={21} />
          )}
        </button>
      </section>

      <section className="irz-chips">
        <button
          className={activeRiskFilter === "all" ? "active" : ""}
          onClick={() => setActiveRiskFilter("all")}
        >
          Todos
        </button>
        <button
          className={activeRiskFilter === "safe" ? "active" : ""}
          onClick={() => setActiveRiskFilter("safe")}
        >
          Seguro
        </button>
        <button
          className={activeRiskFilter === "medium" ? "active" : ""}
          onClick={() => setActiveRiskFilter("medium")}
        >
          Moderado
        </button>
        <button
          className={activeRiskFilter === "high" ? "active" : ""}
          onClick={() => setActiveRiskFilter("high")}
        >
          Alto
        </button>
      </section>

      <section className="floating-map-actions">
        <button
          type="button"
          title="Alertas de proximidad"
          onClick={() => navigate("/alerts")}
        >
          <Bell size={20} />
        </button>

        <button
          type="button"
          title="Mi ubicación"
          onClick={() => setPosition(defaultPosition)}
        >
          <Navigation size={20} />
        </button>
      </section>

      <section className="callego-risk-card">
        <div className="risk-card-header">
          <div>
            <p>Ubicación seleccionada</p>
            <h2>{placeName || "Selecciona un destino"}</h2>
          </div>

          <span className={`risk-badge risk-${currentRisk.level}`}>
            {currentRisk.label}
          </span>
        </div>

        {currentRisk.level !== "safe" && placeName && (
          <div className="risk-warning">
            <AlertTriangle size={19} />
            <p>
              {currentRisk.level === "critical"
                ? "Múltiples reportes recientes en esta zona. Se recomienda fuertemente una ruta alternativa."
                : currentRisk.level === "high"
                  ? "Zona con reportes recientes. Se recomienda ruta segura."
                  : "Algunos reportes registrados cerca. Mantente alerta."}
            </p>
          </div>
        )}

        <div className="risk-actions">
          <button
            type="button"
            className="report-action"
            onClick={() => navigate("/report")}
          >
            <PlusCircle size={18} />
            Reportar
          </button>

          <button
            type="button"
            className="route-action"
            disabled={!placeName}
            onClick={() =>
              navigate("/route-selection", {
                state: {
                  destinationName: placeName,
                  destinationCoords: position,
                  irz: currentRisk.label,
                },
              })
            }
          >
            <MapPin size={18} />
            Iniciar ruta segura
          </button>
        </div>
      </section>

      {searchOpen && (
        <section className="search-fullscreen">
          <div className="search-full-top">
            <button type="button" onClick={() => setSearchOpen(false)}>
              <ArrowLeft size={24} />
            </button>

            <input
              autoFocus
              value={query}
              onChange={(e) => getSuggestions(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByEnter()}
              placeholder="Buscar lugar"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
              >
                <X size={22} />
              </button>
            )}
          </div>

          <div className="recent-searches">
            <h3>Historial reciente</h3>

            {suggestions.length === 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => getSuggestions("San Juan de Lurigancho")}
                >
                  <Clock size={20} />
                  San Juan de Lurigancho
                </button>

                <button
                  type="button"
                  onClick={() => getSuggestions("Estación Bayóvar")}
                >
                  <Clock size={20} />
                  Estación Bayóvar
                </button>

                <button
                  type="button"
                  onClick={() => getSuggestions("Los Jardines")}
                >
                  <Clock size={20} />
                  Los Jardines
                </button>
              </>
            ) : (
              suggestions.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => selectPlace(place)}
                >
                  <MapPin size={20} />

                  <div>
                    <strong>{place.name}</strong>
                    <span>{place.address || "Lima, Perú"}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="safe-destinations-card">
            <h3>Destinos seguros sugeridos</h3>

            <button
              type="button"
              onClick={() =>
                getSuggestions("Mall Aventura San Juan de Lurigancho")
              }
            >
              <MapPin size={20} />
              <div>
                <strong>Mall Aventura SJL</strong>
                <span>Zona moderada · recomendado</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => getSuggestions("Estación Bayóvar")}
            >
              <MapPin size={20} />
              <div>
                <strong>Estación Bayóvar</strong>
                <span>Alta concurrencia · ruta sugerida</span>
              </div>
            </button>
          </div>
        </section>
      )}

      {showInbox && (
        <section className="reports-inbox">
          <div className="sheet-handle"></div>
          <div className="inbox-header">
            <div>
              <p>Bandeja comunitaria</p>
              <h2>Reportes cercanos</h2>
            </div>
            <button type="button" onClick={() => setShowInbox(false)}>
              ×
            </button>
          </div>

          {communityReports.length === 0 ? (
            <div className="empty-reports">
              <p>No hay reportes todavía.</p>
            </div>
          ) : (
            communityReports.map((report) => (
              <button
                key={report.id}
                type="button"
                className="social-report-card"
                onClick={() =>
                  navigate("/report-detail", {
                    state: {
                      report,
                      userPhoto,
                      myReactions,
                    },
                  })
                }
              >
                <div className="social-avatar">
                  {!report.anonymous && userPhoto ? (
                    <img src={userPhoto} alt="Perfil" />
                  ) : (
                    <UserCircle2 size={28} />
                  )}
                </div>

                <div className="social-report-content">
                  <h3>{report.reporter}</h3>

                  <strong>{report.type}</strong>

                  <p>{report.description || "Sin descripción adicional"}</p>

                  <p className="detail-location">
                    <MapPin size={14} />
                    {report.location}
                  </p>

                  <div className="report-reactions">
                    <small>
                      <ThumbsUp size={12} />
                      {report.reactions?.useful || 0}
                    </small>

                    <small>
                      <Eye size={12} />
                      {report.reactions?.surprised || 0}
                    </small>

                    <small>
                      <ShieldAlert size={12} />
                      {report.reactions?.alert || 0}
                    </small>
                  </div>
                </div>
              </button>
            ))
          )}
        </section>
      )}
    </main>
  );
}

export default HeatMap;
