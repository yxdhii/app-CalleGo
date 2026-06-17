import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-callego.png";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="screen splash">
      <section className="splash-content">
        <img src={logo} alt="Logo CalleGo" className="splash-logo" />
        <h1>CalleGo</h1>
        <p>La calle segura en tu mano</p>
      </section>

      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="home-indicator"></div>
    </main>
  );
}

export default Splash;
