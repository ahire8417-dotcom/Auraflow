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
 * Fixed initialization pattern for Next.js 15 App Router.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    firestore = getFirestore(app);
    auth = getAuth(app);
    
    return { app, firestore, auth };
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
