import { Redirect } from 'expo-router';
import { useAuth } from '../auth/authContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
