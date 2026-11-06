# HBPlus Auth & Workspace App

Cross-platform React Native / Expo application with Google OAuth authentication and domain-based access restriction (`@hbplus.fit`). It runs on Android, iOS, and the web from the same codebase.

## Features
- Google Sign-In with `@hbplus.fit` domain restriction and email verification check.
- Native Google Sign-In through Firebase credentials on Android/iOS.
- Protected Dashboard (web & mobile).
- Admin Panel for user management and role assignment.
- Secure Firestore Rules enforcing role immutability and access control.

## Setup

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npx expo`)
- Firebase CLI (for emulator & rules deployment)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your Firebase project credentials. The current development setup also allows `kshirodbiswal208@gmail.com` for local testing only:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm start
   ```

## Running
- **Web**: `npm run web`
- **Android**: `npm android`
- **iOS**: `npm ios`

### Native Google Sign-In setup

The Android package and iOS bundle identifier are both `com.hbplus.authapp`, matching the Firebase configuration files in this repository. Before creating a native build:

1. In Firebase Console, enable Google under Authentication -> Sign-in method.
2. Add the Android app with package `com.hbplus.authapp`.
3. Add the SHA-1 and SHA-256 fingerprints for the debug and release keystores.
4. Confirm the Web client ID in `.env` is the OAuth 2.0 Web client ID (not the Android client ID).
5. Re-download `google-services.json` after any Firebase app change.

The iOS values in `app.json` are sourced from `GoogleService-Info.plist`:

- `ios.bundleIdentifier`: `com.hbplus.authapp` (the plist `BUNDLE_ID`).
- `ios.googleServicesFile`: `./GoogleService-Info.plist` (the checked-in plist path).
- Google Sign-In plugin `iosUrlScheme`: `` (the plist `REVERSED_CLIENT_ID`).

Do not use the plist `CLIENT_ID` as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`; that environment variable must remain the OAuth 2.0 Web client ID.

Expo Go cannot load this native module. Create a development build instead:

```bash
npx eas login
npx eas build --profile development --platform android
```

Install the generated APK on an emulator/device with Google Play Services, then run:

```bash
npx expo start --dev-client
```

### Android test checklist

- `kshirodbiswal208@gmail.com` is accepted in development as the configured test account.
- An `@hbplus.fit` account is accepted.
- Any other domain displays: `Access restricted. Please login using your official domain email.`
- Opening `/dashboard` while signed out redirects to `/login`.
- Logout prevents access to protected routes.

## Testing & Type Checking
- Run tests: `npm test`
- Run type check: `npm run type-check`

## Admin Bootstrapping
To grant the first admin user:
1. Sign in to the app using your `@hbplus.fit` account.
2. Open the Firebase Console -> Firestore Database -> `users` collection.
3. Locate your user document (matching your Auth UID) and update the `role` field from `'user'` to `'admin'`.
4. Refresh the app; the Admin link will appear in the dashboard header.

## Firestore Security Rules & Emulator
- Rules are defined in `firestore.rules`.
- Emulator configuration is in `firebase.json`.
- Run emulators locally:
  ```bash
  firebase emulators:start
  ```

## Web deployment (Netlify)

Deployment is intentionally manual:

1. Set all `EXPO_PUBLIC_*` values from `.env.example` in Netlify site environment variables.
2. Keep `EXPO_PUBLIC_TEST_ALLOWED_EMAILS=kshirodbiswal208@gmail.com` only for a private testing deployment.
3. Use build command `npx expo export --platform web`.
4. Use `dist` as the publish directory.
5. Add the Netlify hostname to Firebase Authentication -> Settings -> Authorized domains.
6. After verification, remove the test email from `.env`, remove the temporary Gmail exception from `firestore.rules`, deploy the rules, and create a fresh production build.

The deployment URL should be added here after publishing:

```text
Production URL: <add Netlify URL>
```

## Authentication flow

On web, Firebase `signInWithPopup` is used. On Android/iOS, `@react-native-google-signin/google-signin` obtains a Google ID token and Firebase signs in with a Google credential. After either flow, the app validates the email domain before creating or reading the Firestore user record. Expo Router protects the dashboard and admin routes, while Firestore rules enforce the same domain and role restrictions server-side.


### Platform status
Web and Android: tested. iOS: configuration (bundle identifier, GoogleService-Info.plist,
URL scheme) is prepared, but not tested on a device or simulator because no macOS
environment was available.
