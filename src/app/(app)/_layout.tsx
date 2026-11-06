import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../auth/authContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}