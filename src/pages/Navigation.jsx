import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import {
  ChevronLeft,
  Shield,
  Navigation as NavIcon,
  MapPin,
  Clock,
  Footprints,
  Bike,
  Car,
} from "lucide-react";

const defaultPosition = [-12.0297, -77.0107];

function FollowUser({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 17, {
      animate: true,
      duration: 1,
    });
  }, [position, map]);

  return null;
}

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const transport = location.state?.transport || "walk";
  const selectedRoute = location.state?.route || "safe";
  const originFromRoute = location.state?.originCoords || defaultPosition;
  const destinationPosition =
    location.state?.destinationCoords || defaultPosition;
  const destinationName =
    location.state?.destinationName || "Destino seleccionado";
  const [userPosition, setUserPosition] = useState(originFromRoute);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [routeCoords, setRouteCoords] = useState(
    location.state?.routeCoords || [],
  );

  const transportLabel = {
    walk: "A pie",
    bike: "Bicicleta",
    car: "Auto",
  };

  const transportIcon = {
    walk: <Footprints size={18} />,
    bike: <Bike size={18} />,
    car: <Car size={18} />,
  };

  const osrmProfile = {
    walk: "foot",
    bike: "foot",
    car: "driving",
  };

  const estimatedTime = {
    walk: selectedRoute === "safe" ? "24 min" : "14 min",
    bike: selectedRoute === "safe" ? "10 min" : "6 min",
    car: selectedRoute === "safe" ? "6 min" : "4 min",
  };

  const movementStatus =
    speed < 1
      ? "Detenido"
      : speed < 7
        ? "Caminando"
        : speed < 20
          ? "En bicicleta"
          : "En vehículo";

  /*

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);

        setSpeed((position.coords.speed || 0) * 3.6);
        setIsTracking(true);
      },
      () => {
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  */

  useEffect(() => {
    setIsTracking(true);
  }, []);

  useEffect(() => {
    const getRealRoute = async () => {
      try {
        const profile = osrmProfile[transport] || "foot";

        const url = `https://router.project-osrm.org/route/v1/${profile}/${userPosition[1]},${userPosition[0]};${destinationPosition[1]},${destinationPosition[0]}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes || !data.routes[0]) {
          setRouteCoords([]);
          return;
        }

        const coords = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        setRouteCoords(coords);
      } catch (error) {
        console.log("No se pudo calcular la ruta real:", error);
        setRouteCoords([]);
      }
    };

    getRealRoute();
  }, [userPosition, destinationPosition, transport]);

  return (
    <main className="screen navigation-trip-screen">
      <MapContainer
        center={userPosition}
        zoom={17}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        className="real-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FollowUser position={userPosition} />

        <Marker position={userPosition}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>

        <Marker position={destinationPosition}>
          <Popup>{destinationName}</Popup>
        </Marker>

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: selectedRoute === "safe" ? "#2563eb" : "#f97316",
              weight: 6,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>

      <section className="nav-top-card">
        <button onClick={() => navigate("/route-selection")}>
          <ChevronLeft size={22} />
        </button>

        <div>
          <p>
            {selectedRoute === "safe"
              ? "Ruta segura activa"
              : "Ruta rápida activa"}
          </p>
          <h2>{destinationName}</h2>
        </div>

        <Shield size={24} />
      </section>

      <section className="nav-info-card">
        <div className="nav-status">
          <span className={isTracking ? "active" : ""}></span>
          {isTracking ? "GPS siguiendo tu ubicación" : "Buscando GPS..."}
        </div>

        <div className="movement-status">
          Movimiento detectado: <strong>{movementStatus}</strong>
        </div>

        <div className="nav-stats">
          <article>
            <Clock size={18} />
            <strong>{estimatedTime[transport]}</strong>
            <p>restantes</p>
          </article>

          <article>
            <MapPin size={18} />
            <strong>1.8 km</strong>
            <p>distancia</p>
          </article>

          <article>
            {transportIcon[transport]}
            <strong>{transportLabel[transport]}</strong>
            <p>modo</p>
          </article>
        </div>

        <button onClick={() => navigate("/trip-complete")}>
          <NavIcon size={20} />
          Finalizar trayecto
        </button>
      </section>

    </main>
  );
}

export default Navigation;
