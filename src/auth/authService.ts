/**
 * Firebase Authentication Service
 * Handles Google OAuth sign-in for both web and native platforms
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  UserCredential,
  User as FirebaseUser,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { getNativePersistence } from './firebasePersistence';
import { validateDomain } from '../utils/domainValidator';
import { UserRole, GoogleAuthResult, AuthError } from '../types/auth';

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const getFirebaseAuth = (): ReturnType<typeof getAuth> => {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getNativePersistence(),
    });
  } catch (error: unknown) {
    const authError = error as { code?: string };
    if (authError.code !== 'auth/already-initialized') {
      throw error;
    }
    return getAuth(app);
  }
};

const auth = getFirebaseAuth();
const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const getNativeGoogleSignin = () => {
  const { getGoogleSignin } = require('./googleSignIn.native') as typeof import('./googleSignIn.native');
  return getGoogleSignin();
};

/**
 * Sign in with Google using platform-specific approach
 * Web: Firebase signInWithPopup
 * Native: @react-native-google-signin/google-signin with a Firebase credential
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  try {
    if (Platform.OS === 'web') {
      // Set persistence for web
      await setPersistence(auth, browserLocalPersistence);

      // Use signInWithPopup for web
      const result = await signInWithPopup(auth, googleProvider);
      return await toGoogleAuthResult(result);
    }

    const GoogleSignin = getNativeGoogleSignin();
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
    const response = await GoogleSignin.signIn();

    if (response.type !== 'success') {
      throw new Error('Google Sign-In was cancelled.');
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new Error('Google Sign-In did not return an ID token.');
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return await toGoogleAuthResult(result);
  } catch (error: unknown) {
    const nativeError = error as { code?: string; message?: string };
    const code = nativeError.code || 'AUTH_ERROR';
    const message = code === 'PLAY_SERVICES_NOT_AVAILABLE'
      ? 'Google Play Services is not available on this device.'
      : code === 'SIGN_IN_CANCELLED'
        ? 'Google Sign-In was cancelled.'
        : error instanceof Error
          ? error.message
          : 'Unknown authentication error';
    const authError: AuthError = {
      code,
      message,
    };
    if (__DEV__) {
      console.error('Google Sign-In failed:', authError.code, authError.message);
    }
    throw authError;
  }
};

const toGoogleAuthResult = async (result: UserCredential): Promise<GoogleAuthResult> => {
  const user = result.user;
  const idToken = await user.getIdToken();
  const accessToken = (user as unknown as { accessToken?: string }).accessToken || '';

  return {
    idToken,
    accessToken,
    user: {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    },
  };
};

/**
 * Validate user's email domain after sign-in
 * @returns true if domain is allowed, false otherwise
 */
export const validateUserDomain = (email: string): boolean => {
  return validateDomain(email);
};

/**
 * Get user role from Firestore
 * First get-or-create users/{uid} (role "user" on creation, never overwrite an existing role).
 */
export const getUserRole = async (uid: string, email: string): Promise<UserRole> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return (data.role as UserRole) || 'user';
  }

  // Create new user document with default role and lastLoginAt included in initial create
  const newUser = {
    uid,
    email,
    role: 'user',
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  await setDoc(userRef, newUser);
  return 'user';
};

/**
 * Update user's last login timestamp
 * Only updates if the document already exists. Never calls update on a doc that does not exist.
 */
export const updateLastLogin = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    await updateDoc(userRef, { lastLoginAt: new Date() });
  }
};

/**
 * List all user documents (admin only).
 */
export const listUsers = async (): Promise<Array<{
  uid: string;
  email: string;
  role: UserRole;
  lastLoginAt?: Date;
}>> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        email: data.email || '',
        role: (data.role as UserRole) || 'user',
        lastLoginAt: data.lastLoginAt?.toDate?.() || data.lastLoginAt,
      };
    });
  } catch (error) {
    console.error('Error listing users:', error);
    return [];
  }
};

/**
 * Update another user's role (admin only).
 */
export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    if (Platform.OS !== 'web') {
      const GoogleSignin = getNativeGoogleSignin();
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }
    }
  } catch (error) {
    const authError: AuthError = {
      code: 'SIGNOUT_ERROR',
      message: error instanceof Error ? error.message : 'Failed to sign out',
    };
    throw authError;
  }
};

/**
 * Subscribe to auth state changes
 * @returns unsubscribe function
 */
export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current Firebase user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export { auth, db };
