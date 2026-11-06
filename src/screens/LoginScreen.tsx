/**
 * Login Screen - Google OAuth authentication with domain validation
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/authContext';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';

const LoginScreen: React.FC = () => {
  const { login, loading, signingIn, error } = useAuth();

  const handleGoogleSignIn = async () => {
    await login();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo / Brand */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in with your @hbplus.fit account</Text>

        {/* Google Sign-In Button */}
        <Button
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          variant="primary"
          loading={loading || signingIn}
          style={styles.googleButton}
        />

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            containerStyle={styles.errorContainer}
          />
        )}

        {/* Domain Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Only users with @hbplus.fit email addresses can access this application.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5F6368',
    marginBottom: 32,
    textAlign: 'center',
  },
  googleButton: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  errorContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;
