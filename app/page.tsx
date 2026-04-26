export default function HomePage() {
  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1>JobMate｜就活管理アプリ</h1>

      <p>
        JobMateは、企業・ES・面接・日程を一元管理できる就活支援ツールです。
      </p>

      <h2>主な機能</h2>
      <ul>
        <li>企業情報の管理</li>
        <li>ESの保存・整理</li>
        <li>選考ステータスの可視化</li>
        <li>説明会・面接の日程管理</li>
      </ul>

      <h2>こんな人におすすめ</h2>
      <ul>
        <li>就活を効率化したい人</li>
        <li>複数企業を管理したい人</li>
      </ul>

      <p>
        <a href="/dashboard">アプリを使う（ログイン）</a>
      </p>

      <hr />

      <p>
        <a href="/features">機能紹介</a> |{' '}
        <a href="/privacy">プライバシーポリシー</a> |{' '}
        <a href="/terms">利用規約</a>
      </p>
    </main>
  );
}
