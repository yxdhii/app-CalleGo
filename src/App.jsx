import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import HeatMap from "./pages/HeatMap";
import ReportDetail from "./pages/ReportDetail";
import PublicProfile from "./pages/PublicProfile";
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
import Notifications from "./pages/Notifications";
import Alerts from "./pages/Alerts";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/heatmap" element={<HeatMap />} />
          <Route path="/report-detail" element={<ReportDetail />} />
          <Route path="/public-profile" element={<PublicProfile />} />
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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </PhoneFrame>
    </BrowserRouter>
  );
}

export default App;
