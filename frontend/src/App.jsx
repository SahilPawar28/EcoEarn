import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import RecyclingInfo from "./pages/RecyclingInfo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./dashboards/UserDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import RecyclerDashboard from "./dashboards/RecyclerDashboard";
import CollectorDashboard from "./dashboards/CollectorDashboard";
import SchedulePickup from "./pages/SchedulePickup";
import MyPickups from "./pages/MyPickups";
import ScheduledPickups from "./pages/recycler/ScheduledPickups";
import ConfirmPickup from "./pages/recycler/ConfirmPickup";
import UploadReport from "./pages/recycler/UploadReport";
import ViewReports from "./pages/recycler/ViewReports";
import TrackRecycledMaterial from "./pages/recycler/TrackRecycledMaterial";
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  return user && allowedRoles.includes(user.role) ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/recycling-info" element={<RecyclingInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard/user" element={<PrivateRoute element={<UserDashboard />} allowedRoles={["user"]} />} />
          <Route path="/dashboard/admin" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
          <Route path="/dashboard/recycler" element={<PrivateRoute element={<RecyclerDashboard />} allowedRoles={["recycler"]} />} />
          <Route path="/dashboard/collector" element={<PrivateRoute element={<CollectorDashboard />} allowedRoles={["collector"]} />} />

          <Route path="/schedule-pickup" element={<PrivateRoute element={<SchedulePickup />} allowedRoles={["user"]} />} />
          <Route path="/my-pickups" element={<PrivateRoute element={<MyPickups />} allowedRoles={["user"]} />} />

          <Route path="/recycler/scheduled-pickups" element={<PrivateRoute element={<ScheduledPickups />} allowedRoles={["recycler", "collector"]} />} />
          <Route path="/recycler/confirm-pickup" element={<PrivateRoute element={<ConfirmPickup />} allowedRoles={["recycler", "collector"]} />} />
          <Route path="/recycler/upload-report" element={<PrivateRoute element={<UploadReport />} allowedRoles={["recycler"]} />} />
          <Route path="/recycler/reports" element={<PrivateRoute element={<ViewReports />} allowedRoles={["recycler", "collector", "admin"]} />} />
          <Route path="/recycler/tracking" element={<PrivateRoute element={<TrackRecycledMaterial />} allowedRoles={["recycler", "collector"]} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
