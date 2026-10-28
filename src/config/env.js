/**
 * Application Runtime Configuration
 * 
 * Safely accesses Vite environment variables with sensible defaults.
 * Secrets should never be committed to repository or exposed via VITE_ prefixes.
 */

export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, ''),
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID 
  },
}
