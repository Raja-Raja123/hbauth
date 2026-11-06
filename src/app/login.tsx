import { Redirect } from 'expo-router';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../auth/authContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  return <LoginScreen />;
}
