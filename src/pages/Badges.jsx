import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";

function Badges() {
  const navigate = useNavigate();

  const [reportCount, setReportCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [trips, setTrips] = useState(0);
  const [verifiedReports, setVerifiedReports] = useState(0);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("callego_reports")) || [];
    const savedTrips = Number(localStorage.getItem("callego_trips") || 0);
    setTrips(savedTrips);

    setReportCount(reports.length);
    setVerifiedReports(
      reports.filter((report) => report.verified === true).length,
    );

    const totalPoints = reports.reduce((sum, report) => {
      return sum + (report.points || 0);
    }, 0);

    setPoints(totalPoints);
  }, []);

  const badges = [
    {
      title: "Primer reporte",
      description: "Realiza tu primer reporte.",
      progress: Math.min(reportCount, 1),
      goal: 1,
    },
    {
      title: "Reportero activo",
      description: "Realiza 10 reportes.",
      progress: Math.min(reportCount, 10),
      goal: 10,
    },
    {
      title: "Vigilante urbano",
      description: "Realiza 25 reportes.",
      progress: Math.min(reportCount, 25),
      goal: 25,
    },
    {
      title: "Guardián del barrio",
      description: "Realiza 50 reportes.",
      progress: Math.min(reportCount, 50),
      goal: 50,
    },
    {
      title: "Primer trayecto",
      description: "Completa tu primera ruta.",
      progress: Math.min(trips, 1),
      goal: 1,
    },
    {
      title: "Explorador urbano",
      description: "Completa 10 trayectos.",
      progress: Math.min(trips, 10),
      goal: 10,
    },
    {
      title: "Fuente confiable",
      description: "Obtén 5 reportes verificados.",
      progress: Math.min(verifiedReports, 5),
      goal: 5,
    },
    {
      title: "Buen ciudadano",
      description: "Alcanza 100 puntos de reputación.",
      progress: Math.min(points, 100),
      goal: 100,
    },
  ];

  return (
    <main className="screen badges-screen">
      <header className="badges-header">
        <button onClick={() => navigate("/profile")}>
          <ChevronLeft size={22} />
          Volver
        </button>

        <h1>Mis insignias</h1>

        <p>Desbloquea insignias participando activamente en CalleGo.</p>
      </header>

      <section className="badges-list">
        {badges.map((badge) => {
          const unlocked = badge.progress >= badge.goal;
          const percent = Math.min(100, (badge.progress / badge.goal) * 100);

          return (
            <article
              key={badge.title}
              className={`badge-card ${unlocked ? "unlocked" : "locked"}`}
            >
              <div className="badge-top">
                <h3>{badge.title}</h3>

                {unlocked ? <span>🏆</span> : <Lock size={18} />}
              </div>

              <p>{badge.description}</p>

              <div className="badge-progress">
                <div className="badge-progress-bar">
                  <div
                    className="badge-progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span>
                  {badge.progress} / {badge.goal}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Badges;
