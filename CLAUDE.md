# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Install Dependencies**: `npm install`
- **Start Development (Expo)**: `npm start`
- **Run Web Version**: `npm run web` (or `npx expo start --web`)
- **Run Android Version**: `npm run android`
- **Run iOS Version**: `npm run ios`
- **Run Tests**: `npm test`
- **Run Single Test**: `npx jest src/utils/domainValidator.test.ts`
- **Lint Code**: `npm run lint`
- **Type Check**: `npm run type-check` (`tsc --noEmit`)

## Architecture & Codebase Structure

- **Framework**: React Native (0.76) with Expo (~52) and Expo Router for file-based routing, written in TypeScript.
- **Directory Layout**:
  - `src/app/`: Expo Router screens and layouts (`_layout.tsx`, `index.tsx`, `screens/LoginScreen.tsx`, `screens/DashboardScreen.tsx`, `screens/ProtectedRoute.tsx`).
  - `src/auth/`: Authentication module (`authContext.tsx`, `authService.ts`).
  - `src/components/`: Reusable UI elements (`Button.tsx`, `LoadingSpinner.tsx`, `ErrorMessage.tsx`).
  - `src/utils/`: Helper utilities like domain validation (`domainValidator.ts`, with tests in `domainValidator.test.ts`).
  - `src/types/`: TypeScript definitions (`auth.d.ts`).
- **Authentication & Security**:
  - Firebase Authentication & Firestore integration for user management, role-based access control (Admin/User), and session state.
  - Domain restriction logic in `src/utils/domainValidator.ts` enforcing official domain access (`@hbplus.fit`).
