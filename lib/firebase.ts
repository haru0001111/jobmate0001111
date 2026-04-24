import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC0yB04SWAwTTMwIEEOd6WthJiy3rWSP5s',
  authDomain: 'jobmate-37622.firebaseapp.com',
  projectId: 'jobmate-37622',
  storageBucket: 'jobmate-37622.firebasestorage.app',
  messagingSenderId: '59344901466',
  appId: '1:59344901466:web:59b1a8814601e6daeb0f63',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firebaseEnabled = true;