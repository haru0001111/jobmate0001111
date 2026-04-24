'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="container">
        <div className="card" style={{ marginTop: 48 }}>
          <span className="badge">認証確認中</span>
          <h1>読み込み中</h1>
          <p>ログイン状態を確認しています。</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container">
        <div className="card" style={{ marginTop: 48 }}>
          <span className="badge">ログインが必要</span>
          <h1>この画面はログイン後に使えます</h1>
          <p>Googleログインを有効にすると、企業・ES・マイページ情報をユーザー単位で保存できます。</p>
          <Link href="/login" className="btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>ログインへ</Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
