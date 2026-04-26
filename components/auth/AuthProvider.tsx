'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider } from '@/lib/firebase';

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User,
} from 'firebase/auth';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 状態監視
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔹 Googleログイン
  async function login() {
    await signInWithPopup(auth, provider);
  }

  // 🔹 ログアウト
  async function logout() {
    await signOut(auth);
  }

  // 🔹 メール登録
  async function register(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  // 🔹 メールログイン
  async function loginWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  // 🔹 メールリンク送信（パスワードなし）
  async function sendMagicLink(email: string) {
    const actionCodeSettings = {
      url: window.location.origin + '/dashboard',
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    localStorage.setItem('emailForSignIn', email);
    alert('ログインリンクをメールに送信しました');
  }

  // 🔹 メールリンクログイン処理
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem('emailForSignIn');

      if (!email) {
        email = window.prompt('メールアドレスを入力してください') || '';
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          localStorage.removeItem('emailForSignIn');
        })
        .catch(console.error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signInWithGoogle: login,
        register,
        loginWithEmail,
        sendMagicLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}