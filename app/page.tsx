import Link from 'next/link';

export const metadata = {
  title: '就活まるごと管理アプリ「就まる」｜企業・ES・日程をまとめて管理',
  description:
    '就活の企業管理、ES管理、日程管理、選考状況をまとめて管理できる無料アプリ「就まる」。就活を効率化したい人向け。',
};

export default function HomePage() {
  return (
    <main style={page}>
      <section style={hero}>
        <p style={badge}>就まる</p>

        <h1 style={title}>
          就活管理を、<br />
          もっとシンプルに。
        </h1>

        <p style={subTitle}>
          就活まるごと管理
        </p>

        <p style={lead}>
          就まるは、企業情報、ES、面接、説明会の日程をひとつにまとめて管理できる就活支援アプリです。
        </p>

        <div style={actions}>
          <Link href="/dashboard" style={primaryButton}>
            アプリを使う
          </Link>
          <Link href="/features" style={secondaryButton}>
            機能を見る
          </Link>
        </div>
      </section>

      <section style={grid}>
        <div style={card}>
          <h2 style={cardTitle}>企業管理</h2>
          <p style={cardText}>
            企業ごとの選考状況、初任給、年間休日などをまとめて管理できます。
          </p>
        </div>

        <div style={card}>
          <h2 style={cardTitle}>ES管理</h2>
          <p style={cardText}>
            エントリーシートを企業ごとに保存し、いつでも見返せます。
          </p>
        </div>

        <div style={card}>
          <h2 style={cardTitle}>日程管理</h2>
          <p style={cardText}>
            説明会や面接の日程を一括で管理できます。
          </p>
        </div>

        <div style={card}>
          <h2 style={cardTitle}>企業比較</h2>
          <p style={cardText}>
            初任給・年間休日・勤務地などを横並びで比較できます。
          </p>
        </div>
      </section>

      <footer style={footer}>
        <Link href="/privacy" style={footerLink}>プライバシーポリシー</Link>
        <Link href="/terms" style={footerLink}>利用規約</Link>
      </footer>
    </main>
  );
}

/* ===== style ===== */

const page: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'clamp(24px, 6vw, 64px)',
  background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
  color: '#0f172a',
};

const hero: React.CSSProperties = {
  maxWidth: 920,
  margin: '0 auto',
  padding: 'clamp(32px, 8vw, 72px) 0',
};

const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 12px',
  borderRadius: 999,
  background: '#eef2ff',
  color: '#4338ca',
  fontSize: 13,
  fontWeight: 800,
};

const title: React.CSSProperties = {
  margin: '20px 0 10px',
  fontSize: 'clamp(42px, 8vw, 72px)',
  lineHeight: 1.05,
  fontWeight: 900,
  letterSpacing: '-0.06em',
};

const subTitle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 18,
  fontWeight: 800,
  color: '#475569',
};

const lead: React.CSSProperties = {
  maxWidth: 640,
  color: '#64748b',
  fontSize: 'clamp(16px, 2vw, 20px)',
  lineHeight: 1.8,
  marginBottom: 28,
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
};

const primaryButton: React.CSSProperties = {
  padding: '13px 18px',
  borderRadius: 14,
  background: '#2563eb',
  color: '#fff',
  fontWeight: 800,
  textDecoration: 'none',
};

const secondaryButton: React.CSSProperties = {
  padding: '13px 18px',
  borderRadius: 14,
  background: '#fff',
  color: '#0f172a',
  border: '1px solid #e5e7eb',
  fontWeight: 800,
  textDecoration: 'none',
};

const grid: React.CSSProperties = {
  maxWidth: 920,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid #e5e7eb',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
};

const cardTitle: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: 20,
  fontWeight: 900,
};

const cardText: React.CSSProperties = {
  margin: 0,
  color: '#64748b',
  lineHeight: 1.7,
};

const footer: React.CSSProperties = {
  maxWidth: 920,
  margin: '40px auto 0',
  paddingTop: 20,
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
};

const footerLink: React.CSSProperties = {
  color: '#475569',
  fontWeight: 700,
  textDecoration: 'none',
};