'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
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
      await login();
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
        <p>
          GoogleログインでJobMateを利用できます。ログイン後は、ユーザーごとに企業やESを保存します。
        </p>

        <div className="grid" style={{ gap: 16 }}>
          <button
            className="btn"
            onClick={() => void handleGoogleLogin()}
            disabled={busy || loading}
          >
            {busy ? 'ログイン中…' : 'Googleで続行'}
          </button>

          <div className="card" style={{ background: '#fafafa' }}>
            <h2 style={{ marginTop: 0 }}>この段階でできること</h2>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Googleログイン</li>
              <li>ログイン後のダッシュボード遷移</li>
              <li>ユーザーごとのデータ保存</li>
            </ul>
          </div>

          {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
        </div>
      </div>
    </main>
  );
}