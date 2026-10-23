import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen label="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
