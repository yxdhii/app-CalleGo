import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";

function Success() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fullName = localStorage.getItem("user_name") || "";
    setFirstName(fullName.split(" ")[0] || "Usuario");
  }, []);

  return (
    <main className="screen success-screen">
      <div className="success-glow"></div>

      <section className="success-content">
        <div className="success-icon">
          <Check size={54} strokeWidth={4} />
        </div>

        <h1>CalleGo</h1>
        <p>La calle segura en tu mano</p>

        <h2>
          ¡Hola,
          <br />
          {firstName}!
        </h2>

        <p className="success-text">
          Tu cuenta fue creada exitosamente.
          <br />
          Muévete más seguro por Lima.
        </p>

        <button onClick={() => navigate("/heatmap")}>
          Ir a inicio <ArrowUpRight size={26} />
        </button>
      </section>

      <div className="home-indicator"></div>
    </main>
  );
}

export default Success;
