import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MapPin,
  Star,
  TrendingUp,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Award,
  Shield,
  Pencil,
  X,
  Camera,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    name: "Usuario",
    email: "",
    initials: "U",
  });
  const [reports, setReports] = useState([]);
  const [points, setPoints] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("user_name") || "Usuario CalleGo";
    const email = localStorage.getItem("user_email") || "";
    const initials =
      localStorage.getItem("user_initials") ||
      name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    const savedPhoto = localStorage.getItem("user_photo");

    setUser({ name, email, initials });
    setPhoto(savedPhoto);

    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];
    setReports(savedReports);

    const totalPoints = savedReports.reduce(
      (sum, r) => sum + (r.points || 0),
      0,
    );
    setPoints(totalPoints);
  }, []);

  const getLevel = (points) => {
    if (points >= 500) {
      return { name: "Guardián", next: "Nivel máximo", min: 500, max: 500 };
    }

    if (points >= 100) {
      return { name: "Confiable", next: "Guardián", min: 100, max: 500 };
    }

    if (points >= 20) {
      return { name: "Regular", next: "Confiable", min: 20, max: 100 };
    }

    return { name: "Nuevo", next: "Regular", min: 0, max: 20 };
  };

  const level = getLevel(points);
  const progressPct = Math.min(100, (points / level.max) * 100);

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_password");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_initials");
    localStorage.removeItem("user_photo");
    localStorage.removeItem("callego_reports");
    localStorage.removeItem("callego_points");
    navigate("/login");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const confirmPhoto = () => {
    localStorage.setItem("user_name", user.name);
    localStorage.setItem("user_email", user.email);

    const initials = user.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    localStorage.setItem("user_initials", initials);
    setUser({ ...user, initials });

    if (previewPhoto) {
      localStorage.setItem("user_photo", previewPhoto);
      setPhoto(previewPhoto);
    }

    setShowPhotoModal(false);
    setPreviewPhoto(null);
  };

  const removePhoto = () => {
    localStorage.removeItem("user_photo");
    setPhoto(null);
    setPreviewPhoto(null);
    setShowPhotoModal(false);
  };

  return (
    <main className="screen profile-screen">
      <div className="profile-topbar">
        <button
          className="profile-back-button"
          onClick={() => navigate("/heatmap")}
        >
          <ChevronLeft size={24} />
          Volver
        </button>
      </div>

      <section className="profile-header">
        <div className="profile-avatar-wrap">
          <div
            className="profile-avatar"
            style={photo ? { backgroundImage: `url(${photo})` } : {}}
          >
            {!photo && user.initials}
          </div>
          <button
            className="avatar-edit-btn"
            onClick={() => setShowPhotoModal(true)}
            title="Editar foto"
          >
            <Pencil size={13} />
          </button>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-badges">
            <span className="level-pill">
              <Shield size={14} /> {level.name}
            </span>
            <span className="points-text">{points} puntos</span>
          </div>
        </div>
      </section>

      <section className="reputation-card">
        <div className="rep-header">
          <span>Tu nivel de reputación</span>
          <b>{level.name}</b>
        </div>

        <div className="rep-progress">
          <div style={{ width: `${progressPct}%` }}></div>
        </div>

        <div className="rep-labels">
          <span>{level.name}</span>
          <span>{level.next}</span>
        </div>

        <p>
          Progreso de reputación
          <strong>
            {points}/{level.max} pts
          </strong>
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <AlertTriangle size={22} className="stat-icon red" />
          <h3>{reports.length}</h3>
          <p>reportes</p>
        </div>
        <div className="stat-card">
          <MapPin size={22} className="stat-icon green" />
          <h3>0</h3>
          <p>km recorridos</p>
        </div>
        <div className="stat-card">
          <Star size={22} className="stat-icon yellow" />
          <h3>N/A</h3>
          <p>calificación</p>
        </div>
        <div className="stat-card">
          <TrendingUp size={22} className="stat-icon blue" />
          <h3>0</h3>
          <p>trayectos</p>
        </div>
      </section>

      <section className="my-reports">
        <div className="my-reports-header">
          <h3>Mis reportes</h3>

          <button
            className="view-all-btn"
            onClick={() => navigate("/my-reports")}
          >
            Ver todos
            <ChevronRight size={16} />
          </button>
        </div>

        {reports.length === 0 ? (
          <p className="empty-reports">Aún no has hecho ningún reporte.</p>
        ) : (
          reports.slice(0, 4).map((r) => (
            <div className="report-item" key={r.id}>
              <span className="report-icon">
                <AlertTriangle size={18} />
              </span>
              <div className="report-info">
                <p className="report-type">{r.type}</p>
                <p className="report-location">{r.location}</p>
                <p className="report-date">{r.date}</p>
              </div>
              <span className="report-points">+{r.points}pts</span>
              <span
                className={`report-status ${
                  r.status === "Verificado" ? "verified" : "pending"
                }`}
              >
                {r.status || "En revisión"}
              </span>
            </div>
          ))
        )}
      </section>

      <section className="badges-section">
        <div className="badges-section-header">
          <h3>Insignias obtenidas</h3>

          <button className="view-all-btn" onClick={() => navigate("/badges")}>
            Ver todas
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="badges-grid">
          <div
            className={`badge-card ${reports.length >= 1 ? "earned" : "locked"}`}
          >
            <Award size={28} />
            <p>Primer reporte</p>
          </div>
          <div
            className={`badge-card ${reports.length >= 10 ? "earned" : "locked"}`}
          >
            <Award size={28} />
            <p>10 reportes</p>
          </div>
          <div
            className={`badge-card ${reports.length >= 20 ? "earned" : "locked"}`}
          >
            <Shield size={28} />
            <p>Guardián</p>
          </div>
        </div>
      </section>

      <section className="profile-menu">
        <div className="menu-item" onClick={() => navigate("/notifications")}>
          <Bell size={20} />
          <span>Notificaciones</span>
          <ChevronRight size={18} className="chevron-right" />
        </div>
        <div className="menu-item" onClick={() => navigate("/privacy")}>
          <Lock size={20} />
          <span>Privacidad</span>
          <ChevronRight size={18} className="chevron-right" />
        </div>
        <div className="menu-item" onClick={() => navigate("/help")}>
          <HelpCircle size={20} />
          <span>Ayuda</span>
          <ChevronRight size={18} className="chevron-right" />
        </div>
        <div className="menu-item" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
          <ChevronRight size={18} className="chevron-right" />
        </div>
      </section>

      <footer className="profile-footer">
        <p>CalleGo</p>
        <p>Versión 1.0.0</p>
        <p>© 2026 CalleGo App</p>
      </footer>

      {showPhotoModal && (
        <div
          className="photo-modal-overlay"
          onClick={() => setShowPhotoModal(false)}
        >
          <div className="photo-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="photo-modal-header">
              <h3>Foto de perfil</h3>
              <button
                className="photo-modal-close"
                onClick={() => setShowPhotoModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="photo-modal-preview">
              {previewPhoto || photo ? (
                <img src={previewPhoto || photo} alt="preview" />
              ) : (
                <div className="photo-modal-placeholder">{user.initials}</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            <button
              className="photo-modal-upload"
              onClick={() => fileInputRef.current.click()}
            >
              <Camera size={16} /> Elegir foto
            </button>

            <div className="profile-edit-fields">
              <label>Nombre</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />

              <label>Correo</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="photo-modal-actions">
              {photo && (
                <button className="photo-modal-remove" onClick={removePhoto}>
                  Eliminar foto
                </button>
              )}
              <button
                className="photo-modal-save"
                onClick={confirmPhoto}
                disabled={!previewPhoto}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home-indicator"></div>
    </main>
  );
}

export default Profile;
