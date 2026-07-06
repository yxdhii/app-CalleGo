import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ZoomControls from "../components/ZoomControls";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import {
  ChevronLeft,
  LocateFixed,
  Search,
  Shield,
  Clock,
  Navigation,
  MapPin,
  Footprints,
  Bike,
  Car,
} from "lucide-react";

const defaultOrigin = [-12.0297, -77.0107];
const locationIcon = L.divIcon({
  className: "custom-location-marker",
  html: renderToStaticMarkup(
    <div className="map-pin-wrapper">
      <MapPin size={34} fill="#3b82f6" />
    </div>,
  ),
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40],
});

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 1.2,
    });
  }, [center, map]);

  return null;
}

function RouteSelection() {
  const [safeInfo, setSafeInfo] = useState(null);
  const [fastInfo, setFastInfo] = useState(null);
  const [showLocationNotice, setShowLocationNotice] = useState(true);
  const [locationStatus, setLocationStatus] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const initialDestination = location.state?.destinationCoords || null;
  const initialDestinationText = location.state?.destinationName || "";

  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(initialDestination);

  const [originText, setOriginText] = useState("Ubicacion actual");
  const [destinationText, setDestinationText] = useState(
    initialDestinationText,
  );

  const [selectedRoute, setSelectedRoute] = useState("safe");
  const [activeInput, setActiveInput] = useState(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState([]);
  const [transport, setTransport] = useState("walk");
  const [safeRouteCoords, setSafeRouteCoords] = useState([]);
  const [fastRouteCoords, setFastRouteCoords] = useState([]);

  const getSuggestions = async (text) => {
    if (text.trim().length < 2) {
      setDynamicSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          text,
        )}&limit=5&lat=-12.0464&lon=-77.0428`,
      );

      const data = await response.json();

      const places = data.features.map((item) => ({
        place_id:
          item.properties.osm_id ||
          `${item.geometry.coordinates[1]}-${item.geometry.coordinates[0]}`,
        lat: item.geometry.coordinates[1],
        lon: item.geometry.coordinates[0],
        display_name: [
          item.properties.name,
          item.properties.street,
          item.properties.city,
          item.properties.country,
        ]
          .filter(Boolean)
          .join(", "),
      }));

      setDynamicSuggestions(places);
    } catch (error) {
      console.log("Error buscando sugerencias:", error);
      setDynamicSuggestions([]);
    }
  };

  const selectSuggestion = (item) => {
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    const name = item.display_name || "Lugar seleccionado";

    if (activeInput === "origin") {
      setOrigin([lat, lon]);
      setOriginText(name);
    } else {
      setDestination([lat, lon]);
      setDestinationText(name);
    }

    setDynamicSuggestions([]);
    setActiveInput(null);
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h} h ${m} min` : `${h} h`;
    }

    return `${minutes} min`;
  };

  const getAdjustedDuration = (distanceKm) => {
    const speed = {
      walk: 5,
      bike: 15,
      car: 35,
    };

    return Math.max(1, Math.round((distanceKm / speed[transport]) * 60));
  };

  useEffect(() => {
    const getRoutes = async () => {
      if (!destination) return;

      try {
        const profile = transport === "car" ? "driving" : "foot";

        const url = `https://router.project-osrm.org/route/v1/${profile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&alternatives=true&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) return;

        const route1 = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        const route2 = data.routes[1]
          ? data.routes[1].geometry.coordinates.map((coord) => [
              coord[1],
              coord[0],
            ])
          : route1;

        const risk1 = calculateRouteRisk(route1);
        const risk2 = calculateRouteRisk(route2);

        const lowerRiskCoords = risk1 <= risk2 ? route1 : route2;
        const higherRiskCoords = risk1 <= risk2 ? route2 : route1;
        const lowerRiskDistance =
          (risk1 <= risk2 ? data.routes[0] : data.routes[1] || data.routes[0])
            .distance / 1000;
        const higherRiskDistance =
          (risk1 <= risk2 ? data.routes[1] || data.routes[0] : data.routes[0])
            .distance / 1000;
        const lowerRiskScore = Math.min(risk1, risk2);
        const higherRiskScore = Math.max(risk1, risk2);

        setSafeRouteCoords(lowerRiskCoords);
        setFastRouteCoords(higherRiskCoords);

        setSafeInfo({
          distance: lowerRiskDistance.toFixed(1),
          duration: getAdjustedDuration(lowerRiskDistance),
          riskScore: lowerRiskScore,
        });

        setFastInfo({
          distance: higherRiskDistance.toFixed(1),
          duration: getAdjustedDuration(higherRiskDistance),
          riskScore: higherRiskScore,
        });
      } catch (error) {
        console.log("Error cargando rutas reales:", error);
      }
    };

    getRoutes();
  }, [origin, destination, transport]);

  const useRealLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Tu navegador no soporta ubicación.");
      return;
    }

    setLocationStatus("Detectando ubicación...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setOrigin([lat, lon]);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );

          const data = await response.json();

          const address =
            [
              data.address?.road,
              data.address?.suburb,
              data.address?.city_district,
              data.address?.city,
            ]
              .filter(Boolean)
              .join(", ") || "Mi ubicación actual";

          setOriginText(address);
        } catch {
          setOriginText("Mi ubicación actual");
        }

        setActiveInput(null);
        setDynamicSuggestions([]);
        setLocationStatus("Ubicación detectada correctamente");
        setShowLocationNotice(false);
      },
      () => {
        setLocationStatus("No se pudo obtener tu ubicación.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const calculateRouteRisk = (routeCoords) => {
    if (!routeCoords || routeCoords.length === 0) return 0;

    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];
    const riskPoints = savedReports.filter((r) => r.coords);

    const RADIUS_METERS = 80;

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

    const sampledPoints = routeCoords.filter((_, i) => i % 5 === 0);

    let riskScore = 0;

    sampledPoints.forEach((point) => {
      riskPoints.forEach((report) => {
        const distance = getDistanceMeters(point, report.coords);
        if (distance <= RADIUS_METERS) {
          riskScore +=
            report.type === "robo" || report.type === "acoso" ? 10 : 4;
        }
      });
    });

    return riskScore;
  };

  return (
    <main className="screen route-map-screen">
      <MapContainer
        key="route-map"
        center={origin}
        zoom={14}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        className="real-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ChangeView center={origin} />
        <ZoomControls />

        <Marker position={origin} icon={locationIcon}>
          <Popup>Origen: {originText}</Popup>
        </Marker>

        {destination && (
          <Marker position={destination} icon={locationIcon}>
            <Popup>Destino: {destinationText}</Popup>
          </Marker>
        )}

        <Circle
          center={origin}
          radius={260}
          pathOptions={{
            color: "#22c55e",
            fillColor: "#22c55e",
            fillOpacity: 0.18,
          }}
        />

        {destination && (
          <>
            <Circle
              center={destination}
              radius={300}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.18,
              }}
            />

            {safeRouteCoords.length > 0 && (
              <Polyline
                positions={safeRouteCoords}
                pathOptions={{
                  color: "#22c55e",
                  weight: selectedRoute === "safe" ? 7 : 4,
                  opacity: selectedRoute === "safe" ? 0.95 : 0.4,
                }}
              />
            )}

            {fastRouteCoords.length > 0 && (
              <Polyline
                positions={fastRouteCoords}
                pathOptions={{
                  color: "#f97316",
                  weight: selectedRoute === "fast" ? 7 : 4,
                  opacity: selectedRoute === "fast" ? 0.95 : 0.4,
                }}
              />
            )}
          </>
        )}
      </MapContainer>

      <section className="route-map-top">
        <button
          className="route-icon-back"
          onClick={() => navigate("/heatmap")}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="route-inputs-card">
          <div className="route-input-row">
            <LocateFixed size={17} />
            <input
              value={originText}
              onFocus={() => setActiveInput("origin")}
              onChange={(e) => {
                setOriginText(e.target.value);
                setActiveInput("origin");
                getSuggestions(e.target.value);
              }}
              placeholder="Mi ubicación"
            />
          </div>

          <div className="route-input-row">
            <Search size={17} />
            <input
              value={destinationText}
              onFocus={() => setActiveInput("destination")}
              onChange={(e) => {
                setDestinationText(e.target.value);
                setActiveInput("destination");
                getSuggestions(e.target.value);
              }}
              placeholder="Elegir destino"
            />
          </div>
        </div>
        <div className="transport-floating">
          <button
            className={transport === "walk" ? "active" : ""}
            onClick={() => setTransport("walk")}
          >
            <Footprints size={20} />
          </button>

          <button
            className={transport === "bike" ? "active" : ""}
            onClick={() => setTransport("bike")}
          >
            <Bike size={20} />
          </button>

          <button
            className={transport === "car" ? "active" : ""}
            onClick={() => setTransport("car")}
          >
            <Car size={20} />
          </button>
        </div>
      </section>

      {showLocationNotice && (
        <section className="location-notice">
          <div>
            <h3>Usar tu ubicación real</h3>
            <p>
              CalleGo puede calcular rutas más precisas usando tu ubicación
              actual.
            </p>
            {locationStatus && <span>{locationStatus}</span>}
          </div>

          <div className="location-notice-actions">
            <button type="button" onClick={useRealLocation}>
              Permitir
            </button>

            <button type="button" onClick={() => setShowLocationNotice(false)}>
              Ahora no
            </button>
          </div>
        </section>
      )}

      {activeInput && dynamicSuggestions.length > 0 && (
        <div className="route-suggestions">
          {dynamicSuggestions.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => selectSuggestion(item)}
            >
              <MapPin size={16} />

              <div>
                <p>{item.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!destination && (
        <section className="route-options-sheet">
          <div className="sheet-handle"></div>

          <h2>Rutas disponibles</h2>

          <p className="route-hint">
            Escribe un destino y selecciona una sugerencia.
          </p>
        </section>
      )}

      {destination && (
        <section className="route-options-sheet">
          <div className="sheet-handle"></div>

          <h2>Rutas disponibles</h2>

          <button
            className={`route-choice ${
              selectedRoute === "safe" ? "active" : ""
            }`}
            onClick={() => setSelectedRoute("safe")}
          >
            <div className="route-choice-icon safe">
              <Shield size={22} />
            </div>

            <div>
              <h3>Ruta segura</h3>
              <p>
                IRZ {safeInfo?.riskScore || 0} · {safeInfo?.distance || "--"} km
                · Recomendada
              </p>
            </div>

            <strong>
              {safeInfo ? formatDuration(safeInfo.duration) : "--"}
            </strong>
          </button>

          <button
            className={`route-choice ${
              selectedRoute === "fast" ? "active fast" : ""
            }`}
            onClick={() => setSelectedRoute("fast")}
          >
            <div className="route-choice-icon fast">
              <Clock size={22} />
            </div>

            <div>
              <h3>Ruta rápida</h3>
              <p>
                IRZ {fastInfo?.riskScore || 0} · {fastInfo?.distance || "--"} km
              </p>
            </div>

            <strong>
              {fastInfo ? formatDuration(fastInfo.duration) : "--"}
            </strong>
          </button>

          <button
            className="start-safe-trip"
            onClick={() =>
              navigate("/navigation", {
                state: {
                  originCoords: origin,
                  originName: originText,
                  destinationCoords: destination,
                  destinationName: destinationText,
                  transport,
                  route: selectedRoute,
                  routeCoords:
                    selectedRoute === "safe"
                      ? safeRouteCoords
                      : fastRouteCoords,
                },
              })
            }
          >
            <Navigation size={20} />
            Iniciar trayecto
          </button>
        </section>
      )}
    </main>
  );
}

export default RouteSelection;
