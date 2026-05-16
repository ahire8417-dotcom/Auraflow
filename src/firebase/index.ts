'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

/**
 * Initializes Firebase services as singletons.
 * Handles both client-side and server-side environments safely.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  } else {
    // Basic fallback for SSR environments
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
  
  firestore = getFirestore(app);
  auth = getAuth(app);
  
  return { app, firestore, auth };
}

// Re-export core modules for easy access
export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export * from './errors';
export * from './error-emitter';
