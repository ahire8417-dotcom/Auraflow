'use client';

/**
 * AURAFLOW FIREBASE CONFIGURATION
 * 
 * IMPORTANT: To fix the "API Key Not Valid" error:
 * 1. Visit https://console.firebase.google.com/
 * 2. Select your project: "auraflow-app"
 * 3. Go to Project Settings > General > Your apps
 * 4. Copy the "firebaseConfig" object and replace the values below.
 */
export const firebaseConfig = {
  apiKey: "AIzaSy_REPLACE_WITH_REAL_KEY", // Get this from Firebase Console
  authDomain: "auraflow-app.firebaseapp.com",
  projectId: "auraflow-app",
  storageBucket: "auraflow-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};
