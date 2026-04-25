'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadItems, removeItem, saveItem } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

type Company = {
  id: string;
  name: string;
  status: string;
  testType: string;
};

const initialCompanies: Company[] = [
  { id: 'c1', name: 'OpenAI Japan', status: 'interested', testType: 'SPI' },
];

const statusLabel: Record<string, string> = {
  interested: '興味あり',
  applied: '応募済み',
  interview: '面接中',
  offer: '内定',
  rejected: '落選',
};

export default function DashboardPage() {
  const { user, login, logout } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('interested');
  const [testType, setTestType] = useState('SPI');

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  async function refresh() {
    setCompanies(await loadItems('companies', user.uid, initialCompanies));
  }

  async function saveCompany() {
    if (!name.trim()) {
      alert('会社名を入力してね');
      return;
    }

    const company: Company = {
      id: `c-${Date.now()}`,
      name,
      status,
      testType,
    };

    await saveItem('companies', user.uid, company);
    setName('');
    refresh();
  }

  async function deleteCompany(id: string) {
    if (!confirm('削除する？')) return;
    await removeItem('companies', user.uid, id);
    refresh();
  }

  if (!user) {
    return (
      <main style={page}>
        <section style={heroCard}>
          <p style={badge}>JobMate</p>
          <h1 style={heroTitle}>就活管理を、ひとつに。</h1>
          <p style={heroText}>
            企業、ES、選考状況をまとめて管理できる就活サポートアプリです。
          </p>
          <button onClick={login} style={primaryButton}>Googleでログイン</button>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>JobMate</p>
          <h1 style={title}>ダッシュボード</h1>
          <p style={muted}>企業・ES・選考状況をまとめて管理</p>
        </div>
        <button onClick={logout} style={ghostButton}>ログアウト</button>
      </header>

      <section style={statsGrid}>
        <div style={statCard}>
          <div style={statNumber}>{companies.length}</div>
          <div style={muted}>登録企業</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>
            {companies.filter((c) => c.status === 'applied' || c.status === 'interview').length}
          </div>
          <div style={muted}>選考中</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>
            {companies.filter((c) => c.status === 'offer').length}
          </div>
          <div style={muted}>内定</div>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>企業を追加</h2>

        <div style={formGrid}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="会社名"
            style={input}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)} style={input}>
            <option value="interested">興味あり</option>
            <option value="applied">応募済み</option>
            <option value="interview">面接中</option>
            <option value="offer">内定</option>
            <option value="rejected">落選</option>
          </select>

          <select value={testType} onChange={(e) => setTestType(e.target.value)} style={input}>
            <option>SPI</option>
            <option>TG-WEB</option>
            <option>玉手箱</option>
            <option>Web-CAB</option>
            <option>なし</option>
          </select>

          <button onClick={saveCompany} style={primaryButton}>追加する</button>
        </div>
      </section>

      <section style={card}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>企業一覧</h2>
          <Link href="/essays" style={ghostButton}>ES管理へ</Link>
        </div>

        <div style={list}>
          {companies.map((c) => (
            <article key={c.id} style={companyCard}>
              <div>
                <h3 style={companyName}>{c.name}</h3>
                <div style={tagRow}>
                  <span style={tag}>{statusLabel[c.status] ?? c.status}</span>
                  <span style={tag}>{c.testType}</span>
                </div>
              </div>

              <div style={actions}>
                <Link href={`/companies/${c.id}`} style={ghostButton}>詳細</Link>
                <button onClick={() => deleteCompany(c.id)} style={dangerButton}>削除</button>
              </div>
            </article>
          ))}

          {companies.length === 0 && (
            <div style={empty}>まだ企業がありません。上のフォームから追加してね。</div>
          )}
        </div>
      </section>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'clamp(16px, 4vw, 32px)',
  background: '#f6f7fb',
  color: '#111827',
  maxWidth: 1100,
  margin: '0 auto',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
  marginBottom: 24,
  flexWrap: 'wrap',
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 'clamp(26px, 5vw, 32px)',
  fontWeight: 800,
};

const heroCard: React.CSSProperties = {
  marginTop: 'clamp(32px, 10vw, 80px)',
  border: '1px solid #e5e7eb',
  borderRadius: 24,
  padding: 'clamp(22px, 6vw, 36px)',
  background: '#fff',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
};

const heroTitle: React.CSSProperties = {
  margin: '8px 0',
  fontSize: 'clamp(30px, 8vw, 40px)',
  fontWeight: 900,
};

const heroText: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 16,
  marginBottom: 24,
  lineHeight: 1.7,
};

const badge: React.CSSProperties = {
  display: 'inline-block',
  margin: 0,
  padding: '6px 10px',
  borderRadius: 999,
  background: '#eef2ff',
  color: '#4338ca',
  fontSize: 13,
  fontWeight: 700,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
};

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 16,
  marginBottom: 20,
};

const statCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  padding: 18,
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const statNumber: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
};

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 22,
  padding: 'clamp(16px, 4vw, 22px)',
  marginBottom: 20,
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const sectionHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginBottom: 16,
  flexWrap: 'wrap',
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
};

const formGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: 12,
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 12,
  fontSize: 16,
  background: '#fff',
  minHeight: 44,
};

const primaryButton: React.CSSProperties = {
  padding: '12px 16px',
  border: 'none',
  borderRadius: 12,
  background: '#2563eb',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
  textDecoration: 'none',
  minHeight: 44,
};

const ghostButton: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 12,
  background: '#fff',
  color: '#111827',
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  minHeight: 44,
  display: 'inline-flex',
  alignItems: 'center',
};

const dangerButton: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #fecaca',
  borderRadius: 12,
  background: '#fff1f2',
  color: '#be123c',
  fontWeight: 700,
  cursor: 'pointer',
  minHeight: 44,
};

const list: React.CSSProperties = {
  display: 'grid',
  gap: 12,
};

const companyCard: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'center',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  padding: 18,
  background: '#fafafa',
  flexWrap: 'wrap',
};

const companyName: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: 18,
  fontWeight: 800,
};

const tagRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const tag: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 9px',
  borderRadius: 999,
  background: '#eef2ff',
  color: '#3730a3',
  fontSize: 12,
  fontWeight: 700,
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const empty: React.CSSProperties = {
  border: '1px dashed #d1d5db',
  borderRadius: 16,
  padding: 18,
  color: '#6b7280',
};