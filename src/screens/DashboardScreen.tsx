/**
 * Dashboard Screen - Protected area for authenticated users
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/authContext';
import { Button } from '../components/Button';

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleOpenAdmin = () => {
    router.push('/admin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>HBPlus Dashboard</Text>
        </View>
        {user?.role === 'admin' && (
          <TouchableOpacity style={styles.adminLink} onPress={handleOpenAdmin}>
            <Text style={styles.adminLinkText}>Admin</Text>
          </TouchableOpacity>
        )}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.signOutButton}
        />
      </View>

      <View style={styles.content}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}

          <Text style={styles.userName}>
            {user?.displayName || 'Authorized User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Role:</Text>
            <Text style={styles.roleValue}>
              {user?.role?.toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to HBPlus Workspace</Text>
          <Text style={styles.welcomeText}>
            You have successfully authenticated with your official @hbplus.fit domain email.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
  },
  adminLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  adminLinkText: {
    color: '#4285F4',
    fontWeight: '600',
    fontSize: 14,
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholderText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  roleLabel: {
    fontSize: 12,
    color: '#1967D2',
    fontWeight: '600',
    marginRight: 6,
  },
  roleValue: {
    fontSize: 12,
    color: '#1967D2',
    fontWeight: '700',
  },
  welcomeSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#5F6368',
    lineHeight: 22,
  },
});

export default DashboardScreen;
