/**
 * Authentication type definitions for the application
 */

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  lastLoginAt: Date;
}

export type UserRole = 'admin' | 'user';

export interface AuthState {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  validateDomain: (email: string) => boolean;
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  listUsers: () => Promise<Array<{
    uid: string;
    email: string;
    role: UserRole;
    lastLoginAt?: Date;
  }>>;
}

export interface GoogleAuthResult {
  idToken: string;
  accessToken: string;
  user: {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
  };
}

export interface AuthError {
  code: string;
  message: string;
}
