'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, router, user]);

  async function handleGoogleLogin() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.replace('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Googleログインに失敗しました。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 560, margin: '48px auto' }}>
        <span className="badge">認証</span>
        <h1>ログイン</h1>
        <p>v13 では Google ログインの土台を追加しました。Firestore 本番接続時は、このログインユーザー単位で企業やESを保存する想定です。</p>
        <div className="grid" style={{ gap: 16 }}>
          <button className="btn" onClick={() => void handleGoogleLogin()} disabled={busy || loading}>
            {busy ? 'ログイン中…' : 'Googleで続行'}
          </button>
          <div className="card" style={{ background: '#fafafa' }}>
            <h2 style={{ marginTop: 0 }}>この段階でできること</h2>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>認証状態の表示</li>
              <li>ログイン後のダッシュボード遷移</li>
              <li>保存層に userId を渡すための土台</li>
            </ul>
          </div>
          {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
        </div>
      </div>
    </main>
  );
}
