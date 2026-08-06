import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { env, useMocks } from '@/app/config/env';

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
};

let services: FirebaseServices | null = null;

export function getFirebaseServices(): FirebaseServices | null {
  if (useMocks) return null;
  if (services) return services;

  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const appId = env.VITE_FIREBASE_APP_ID;

  if (!projectId || !apiKey || !appId) {
    console.warn('Firebase config is missing; falling back to UI-only mode.');
    return null;
  }

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        apiKey,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId
      });

  services = {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
    storage: getStorage(app)
  };

  return services;
}
