import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  UserCircle2,
  ShieldCheck,
  Award,
  Heart,
  MapPin,
  CheckCircle2,
} from "lucide-react";

function PublicProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const reporterEmail = state?.reporterEmail;
  const reporterName = state?.reporter || "Usuario CalleGo";
  const reporterPhoto = state?.reporterPhoto;

  const reports = JSON.parse(localStorage.getItem("callego_reports")) || [];

  const publicReports = useMemo(
    () =>
      reports.filter((r) => r.reporterEmail === reporterEmail && !r.anonymous),
    [reports, reporterEmail],
  );

  const verifiedReports = publicReports.filter(
    (r) => r.status === "Verificado",
  ).length;

  const totalPoints = publicReports.reduce(
    (sum, r) => sum + (r.points || 0),
    0,
  );

  const recognitionKey = `callego_recognition_${reporterEmail}`;
  const recognizedKey = `callego_recognized_${reporterEmail}`;

  const [recognitions, setRecognitions] = useState(
    Number(localStorage.getItem(recognitionKey)) || 0,
  );

  const [recognized, setRecognized] = useState(
    localStorage.getItem(recognizedKey) === "true",
  );

  const handleRecognition = () => {
    const nextRecognized = !recognized;
    const nextValue = nextRecognized
      ? recognitions + 1
      : Math.max(0, recognitions - 1);

    setRecognized(nextRecognized);
    setRecognitions(nextValue);

    localStorage.setItem(recognitionKey, String(nextValue));
    localStorage.setItem(recognizedKey, String(nextRecognized));
  };

  return (
    <main className="screen public-profile-screen">
      <header className="public-profile-top">
        <button type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>

        <h2>Perfil público</h2>
      </header>

      <section className="public-profile-card">
        <div className="public-avatar-area">
          {reporterPhoto ? (
            <img src={reporterPhoto} alt="Perfil" className="public-avatar" />
          ) : (
            <div className="public-avatar public-avatar-empty">
              <UserCircle2 size={44} />
            </div>
          )}
        </div>

        <h1>{reporterName}</h1>
        <p>Ciudadano de la comunidad CalleGo</p>

        <div className="trust-pill">
          <ShieldCheck size={15} />
          Perfil visible por reporte público
        </div>

        <div className="public-profile-stats">
          <article>
            <strong>{publicReports.length}</strong>
            <span>Reportes públicos</span>
          </article>

          <article>
            <strong>{verifiedReports}</strong>
            <span>Verificados</span>
          </article>

          <article>
            <strong>{totalPoints}</strong>
            <span>Puntos</span>
          </article>
        </div>

        <div className="public-recognition-box">
          <div>
            <span>Reconocimientos de vecinos</span>
            <strong>{recognitions}</strong>
          </div>

          <button
            type="button"
            className={recognized ? "recognized" : ""}
            onClick={handleRecognition}
          >
            <Heart size={22} fill={recognized ? "currentColor" : "none"} />
          </button>
        </div>
      </section>

      <section className="public-reports-section">
        <h3>Reportes públicos recientes</h3>

        {publicReports.length === 0 ? (
          <p className="public-empty">
            Este usuario no tiene reportes públicos visibles.
          </p>
        ) : (
          publicReports.map((report) => (
            <button
              key={report.id}
              type="button"
              className="public-report-card"
              onClick={() =>
                navigate("/report-detail", {
                  state: { report },
                })
              }
            >
              <div>
                <strong>{report.type}</strong>
                <p>
                  <MapPin size={13} />
                  {report.location}
                </p>
              </div>

              <span>
                <CheckCircle2 size={13} />
                {report.status || "En revisión"}
              </span>
            </button>
          ))
        )}
      </section>
    </main>
  );
}

export default PublicProfile;
