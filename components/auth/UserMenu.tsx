'use client';

import { useAuth } from './AuthProvider';

export function UserMenu() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="row" style={{ gap: 12, alignItems: 'center' }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700 }}>{user.displayName ?? 'ログイン中'}</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>{user.email}</div>
      </div>
      <button className="btn btn-secondary" onClick={() => void logout()}>ログアウト</button>
    </div>
  );
}
