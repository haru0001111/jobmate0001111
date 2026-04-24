import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <div className="card" style={{ marginTop: 60 }}>
        <span className="badge">MVP</span>
        <h1>JobMate</h1>
        <p>就活の説明会・面接・ES締切をまとめて管理する、就活生向けオールインワン管理ツール。</p>
        <div className="row" style={{ marginTop: 18 }}>
          <Link href="/dashboard" className="btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            ダッシュボードを見る
          </Link>
          <Link href="/login" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            ログイン画面
          </Link>
        </div>
      </div>
    </main>
  );
}
