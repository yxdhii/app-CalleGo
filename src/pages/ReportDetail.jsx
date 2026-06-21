import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  UserCircle2,
  AlertTriangle,
  MapPin,
  Heart,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";

function ReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const reportData = location.state?.report;
  

  const [report, setReport] = useState(reportData);
  const [myReactions, setMyReactions] = useState(
    JSON.parse(localStorage.getItem("callego_my_reactions")) || {},
  );

  if (!report) {
    return (
      <main className="screen report-detail-screen">
        <header className="detail-topbar">
          <button type="button" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} />
          </button>
          <h2>Reporte no encontrado</h2>
          <span></span>
        </header>
      </main>
    );
  }

  const handleReaction = (reportId, newType) => {
    const currentType = myReactions[reportId];
    const finalType = currentType === newType ? null : newType;

    const updateReport = (item) => {
      if (item.id !== reportId) return item;

      const reactions = {
        useful: item.reactions?.useful || 0,
        surprised: item.reactions?.surprised || 0,
        alert: item.reactions?.alert || 0,
      };

      if (currentType) {
        reactions[currentType] = Math.max(0, reactions[currentType] - 1);
      }

      if (finalType) {
        reactions[finalType] += 1;
      }

      return {
        ...item,
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

    const updatedReport = updateReport(report);
    setReport(updatedReport);

    const savedReports =
      JSON.parse(localStorage.getItem("callego_reports")) || [];

    localStorage.setItem(
      "callego_reports",
      JSON.stringify(savedReports.map(updateReport)),
    );
  };

  return (
    <main className="screen report-detail-screen">
      <header className="detail-topbar">
        <button type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>

        <h2>Detalle del reporte</h2>

        <span></span>
      </header>

      <section className="detail-post-card">
        <div
          className="detail-user clickable-user"
          onClick={() => {
            if (!report.anonymous) {
              navigate("/public-profile", {
                state: {
                  reporter: report.reporter,
                  reporterPhoto: report.reporterPhoto,
                  reporterEmail: report.reporterEmail,
                },
              });
            }
          }}
        >
          <div className="detail-avatar">
            {!report.anonymous && report.reporterPhoto ? (
              <img src={report.reporterPhoto} alt="Perfil" />
            ) : (
              <UserCircle2 size={28} />
            )}
          </div>

          <article>
            <h3>{report.reporter}</h3>
            <p>{report.date} · Público</p>
          </article>
        </div>

        <strong className="detail-type">{report.type}</strong>

        <p className="detail-description">
          {report.description || "Sin descripción adicional."}
        </p>

        {report.photo ? (
          <img src={report.photo} alt="Evidencia" className="detail-photo" />
        ) : (
          <div className="detail-photo-placeholder">
            <AlertTriangle size={36} />
            <p>Sin evidencia fotográfica</p>
          </div>
        )}

        <p className="detail-location">
          <MapPin size={14} />
          {report.location}
        </p>

        <div className="detail-stats">
          <span>
            <Heart size={13} color="#e74c3c" fill="#e74c3c" />
            {report.reactions?.useful || 0}
          </span>

          <span>
            <CheckCircle2 size={13} color="#4dc98e" />
            {report.reactions?.surprised || 0}
          </span>

          <span>
            <AlertOctagon size={13} color="#f1c40f" />
            {report.reactions?.alert || 0}
          </span>
        </div>

        <div className="detail-reactions">
          <button
            className={
              myReactions[report.id] === "useful" ? "active useful" : ""
            }
            onClick={() => handleReaction(report.id, "useful")}
          >
            <Heart size={15} />
            Útil
          </button>

          <button
            className={
              myReactions[report.id] === "surprised" ? "active confirmed" : ""
            }
            onClick={() => handleReaction(report.id, "surprised")}
          >
            <CheckCircle2 size={15} />
            Confirmar
          </button>

          <button
            className={myReactions[report.id] === "alert" ? "active alert" : ""}
            onClick={() => handleReaction(report.id, "alert")}
          >
            <AlertOctagon size={15} />
            Alerta
          </button>
        </div>
      </section>
    </main>
  );
}

export default ReportDetail;
