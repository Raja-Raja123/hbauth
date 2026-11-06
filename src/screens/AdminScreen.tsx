/**
 * Admin Screen - lists users and allows role management (admin only)
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/authContext';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UserRole } from '../types/auth';

interface UserListItem {
  uid: string;
  email: string;
  role: UserRole;
  lastLoginAt?: Date;
}

const AdminScreen: React.FC = () => {
  const { listUsers, updateUserRole, logout } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await listUsers();
        setUsers(userList);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [listUsers]);

  const handleRoleChange = async (uid: string, currentRole: UserRole) => {
    const newRole: UserRole = currentRole === 'admin' ? 'user' : 'admin';
    Alert.alert(
      `Change role for ${users.find(u => u.uid === uid)?.email}`,
      `Change role from ${currentRole.toUpperCase()} to ${newRole.toUpperCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUpdating(uid);
            try {
              await updateUserRole(uid, newRole);
              setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            } catch (err) {
              Alert.alert('Error', 'Failed to update role');
            } finally {
              setUpdating(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Button
          title="Sign Out"
          onPress={logout}
          variant="outline"
          style={styles.signOutButton}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>User Management</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userMeta}>
                  {item.lastLoginAt
                    ? `Last login: ${item.lastLoginAt.toLocaleDateString()} ${item.lastLoginAt.toLocaleTimeString()}`
                    : 'Never logged in'}
                </Text>
              </View>
              <View style={styles.userActions}>
                <View
                  style={[
                    styles.roleBadge,
                    item.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeUser,
                  ]}
                >
                  <Text style={styles.roleBadgeText}>{item.role.toUpperCase()}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRoleChange(item.uid, item.role)}
                  disabled={updating === item.uid}
                  style={styles.changeRoleButton}
                >
                  <Text style={styles.changeRoleButtonText}>
                    {updating === item.uid ? '...' : item.role === 'admin' ? 'Demote' : 'Promote'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 12,
    color: '#5F6368',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  roleBadgeAdmin: {
    backgroundColor: '#FFF3E0',
  },
  roleBadgeUser: {
    backgroundColor: '#E8F0FE',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1967D2',
  },
  changeRoleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4285F4',
    borderRadius: 8,
  },
  changeRoleButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#5F6368',
    marginTop: 32,
  },
});

export default AdminScreen;