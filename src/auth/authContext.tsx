/**
 * Authentication Context - manages global auth state
 * Uses React Context for state sharing across components
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChange, signOutUser, validateUserDomain, getUserRole, updateLastLogin, listUsers, updateUserRole, signInWithGoogle } from './authService';
import { User, GoogleAuthResult, AuthContextType } from '../types/auth';

// Initialize auth state from context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - wraps the app to provide authentication state
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state and listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        // Validate domain first
        if (!validateUserDomain(firebaseUser.email)) {
          try {
            await signOutUser();
          } catch (signOutError) {
            if (__DEV__) {
              console.error('Unable to sign out a restricted user:', signOutError);
            }
          }
          setUser(null);
          setError('Access restricted. Please login using your official domain email.');
          setLoading(false);
          return;
        }

        try {
          // 1. Get-or-create users/{uid} (role "user" on creation, never overwrite existing role)
          const userRole = await getUserRole(firebaseUser.uid, firebaseUser.email);

          // 2. Only then update lastLoginAt, and only if the doc already exists
          await updateLastLogin(firebaseUser.uid);

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified || false,
            role: userRole,
            createdAt: new Date(),
            lastLoginAt: new Date(),
          });
        } catch (err: unknown) {
          try {
            await signOutUser();
          } catch (signOutError) {
            if (__DEV__) {
              console.error('Unable to clear the failed auth session:', signOutError);
            }
          }
          setUser(null);

          const firebaseError = err as { code?: string; message?: string };
          if (__DEV__ || process.env.NODE_ENV !== 'production') {
            console.log('Firebase error:', firebaseError.code || 'UNKNOWN', firebaseError.message || 'Unknown error');
          }

          if (firebaseError.code === 'permission-denied' || (err instanceof Error && err.message.includes('permission-denied'))) {
            setError('Your account could not be verified. Please contact the administrator.');
          } else {
            setError(err instanceof Error ? err.message : 'An error occurred during authentication');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Clear error helper
  const clearError = () => setError(null);

  // Login with Google
  const login = async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result: GoogleAuthResult = await signInWithGoogle();

      // Validate domain
      if (!validateUserDomain(result.user.email)) {
        setError('Access restricted. Please login using your official domain email.');
        await signOutUser();
        setUser(null);
        throw new Error('Domain not allowed');
      }

      // 1. After domain validation, first get-or-create users/{uid} (role "user" on creation, never overwrite existing role)
      const userRole = await getUserRole(result.user.uid, result.user.email);

      // 2. Only then update lastLoginAt, and only if the doc already exists
      await updateLastLogin(result.user.uid);

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: false,
        role: userRole,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
    } catch (err: unknown) {
      try {
        await signOutUser();
      } catch (signOutError) {
        if (__DEV__) {
          console.error('Unable to clear the failed auth session:', signOutError);
        }
      }
      setUser(null);

      const firebaseError = err as { code?: string; message?: string };
      if (__DEV__ || process.env.NODE_ENV !== 'production') {
        console.log('Firebase error:', firebaseError.code || 'UNKNOWN', firebaseError.message || 'Unknown error');
      }

      if (firebaseError.code === 'permission-denied' || (err instanceof Error && err.message.includes('permission-denied'))) {
        setError('Your account could not be verified. Please contact the administrator.');
      } else if (firebaseError.message && firebaseError.message !== 'Domain not allowed') {
        setError(firebaseError.message);
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      await signOutUser();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    loading,
    signingIn,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    clearError,
    validateDomain: validateUserDomain,
    updateUserRole,
    listUsers,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
