import { APP_FIREBASE_API_KEY, APP_FIREBASE_AUTH_DOMAIN, APP_PROJECT_ID, APP_STORAGE_BUCKET, APP_MESSAGING_SENDER_ID, APP_ID } from '@env';
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: APP_FIREBASE_API_KEY,
  authDomain: APP_FIREBASE_AUTH_DOMAIN,
  projectId: APP_PROJECT_ID,
  storageBucket: APP_STORAGE_BUCKET,
  messagingSenderId: APP_MESSAGING_SENDER_ID,
  appId: APP_ID
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


const auth = getAuth(app);

export { auth };
