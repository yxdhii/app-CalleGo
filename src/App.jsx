import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import HeatMap from "./pages/HeatMap";
import RouteSelection from "./pages/RouteSelection";
import ReportIncident from "./pages/ReportIncident";
import ReportSuccess from "./pages/ReportSuccess";
import Navigation from "./pages/Navigation";
import TripComplete from "./pages/TripComplete";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import MyReports from "./pages/MyReports";
import Badges from "./pages/Badges";
import Help from "./pages/Help";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/heatmap" element={<HeatMap />} />
        <Route path="/route-selection" element={<RouteSelection />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/report-success" element={<ReportSuccess />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/trip-complete" element={<TripComplete />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
