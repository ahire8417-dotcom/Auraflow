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
 * Fixed to ensure immediate synchronization with the config.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }
      
      firestore = getFirestore(app);
      auth = getAuth(app);
      
      return { app, firestore, auth };
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      throw error;
    }
  }
  
  return { 
    app: null as unknown as FirebaseApp, 
    firestore: null as unknown as Firestore, 
    auth: null as unknown as Auth 
  };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export * from './errors';
export * from './error-emitter';
