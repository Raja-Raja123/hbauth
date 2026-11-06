import { Redirect } from 'expo-router';
import { useAuth } from '../../auth/authContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import AdminScreen from '../../screens/AdminScreen';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user?.role !== 'admin') {
    return <Redirect href="/dashboard" />;
  }

  return <AdminScreen />;
}
