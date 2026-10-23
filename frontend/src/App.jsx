import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';
import PublicLayout from './components/layout/PublicLayout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import UserDashboard from './pages/user/Dashboard';
import Weather from './pages/user/Weather';
import DisasterRisk from './pages/user/DisasterRisk';
import Alerts from './pages/user/Alerts';
import MapPage from './pages/user/MapPage';
import EmergencyReport from './pages/user/EmergencyReport';
import MyRequests from './pages/user/MyRequests';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminEmergencyReports from './pages/admin/EmergencyReports';
import AdminUsers from './pages/admin/Users';
import AdminPredictions from './pages/admin/Predictions';
import AdminAlerts from './pages/admin/Alerts';
import AdminShelters from './pages/admin/Shelters';
import AdminHospitals from './pages/admin/Hospitals';
import AdminResources from './pages/admin/Resources';
import Analytics from './pages/admin/Analytics';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="weather" element={<Weather />} />
              <Route path="risk" element={<DisasterRisk />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="map" element={<MapPage />} />
              <Route path="report" element={<EmergencyReport />} />
              <Route path="my-requests" element={<MyRequests />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="reports" element={<AdminEmergencyReports />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="predictions" element={<AdminPredictions />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="shelters" element={<AdminShelters />} />
              <Route path="hospitals" element={<AdminHospitals />} />
              <Route path="resources" element={<AdminResources />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
