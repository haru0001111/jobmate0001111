'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { loadItems } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

type Essay = {
  id: string;
  companyId: string;
  title: string;
  question: string;
  body: string;
  category: string;
};

type Company = {
  id: string;
  name: string;
  status?: string;
  testType?: string;
};

const initialEssays: Essay[] = [];
const initialCompanies: Company[] = [
  { id: 'c1', name: 'OpenAI Japan', status: 'interested', testType: 'SPI' },
];

export default function EssayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, login } = useAuth();

  const [essay, setEssay] = useState<Essay | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      const [essays, companyData] = await Promise.all([
        loadItems<Essay>('essays', user.uid, initialEssays),
        loadItems<Company>('companies', user.uid, initialCompanies),
      ]);

      setEssay(essays.find((e) => e.id === id) ?? null);
      setCompanies(companyData);
      setLoading(false);
    }

    load();
  }, [id, user]);

  const companyName = useMemo(() => {
    if (!essay) return '';
    return companies.find((company) => company.id === essay.companyId)?.name ?? essay.companyId;
  }, [companies, essay]);

  if (!user) {
    return (
      <main style={page}>
        <section style={card}>
          <p style={badge}>JobMate</p>
          <h1 style={title}>ログインが必要です</h1>
          <p style={muted}>ES詳細を見るにはGoogleログインしてください。</p>
          <button onClick={login} style={primaryButton}>Googleでログイン</button>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={page}>
        <section style={card}>
          <p style={muted}>読み込み中...</p>
        </section>
      </main>
    );
  }

  if (!essay) {
    return (
      <main style={page}>
        <section style={card}>
          <p style={badge}>Not Found</p>
          <h1 style={title}>ESが見つかりません</h1>
          <p style={muted}>削除されたか、URLが間違っている可能性があります。</p>
          <Link href="/essays" style={button}>ES一覧へ戻る</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>ES Detail</p>
          <h1 style={title}>{essay.title}</h1>
          <p style={muted}>
            {companyName} / {essay.category} / {essay.body.length}文字
          </p>
        </div>

        <div style={actions}>
          <Link href="/essays" style={button}>ES一覧へ戻る</Link>
          <Link href={`/essays?companyId=${essay.companyId}`} style={button}>
            この企業のES
          </Link>
          <Link href="/essays" style={primaryButton}>
            編集する
          </Link>
        </div>
      </header>

      <section style={statsGrid}>
        <div style={statCard}>
          <div style={statNumber}>{essay.body.length}</div>
          <div style={muted}>本文文字数</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>{essay.question.length}</div>
          <div style={muted}>設問文字数</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>{essay.category}</div>
          <div style={muted}>カテゴリ</div>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>企業</h2>
        <p style={text}>{companyName}</p>
        <p style={muted}>企業ID: {essay.companyId}</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>設問</h2>
        <p style={text}>{essay.question || '未登録'}</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>本文</h2>
        <p style={bodyText}>{essay.body}</p>
      </section>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'clamp(16px, 4vw, 32px)',
  background: '#f6f7fb',
  color: '#111827',
  maxWidth: 960,
  margin: '0 auto',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  marginBottom: 24,
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

const title: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 'clamp(26px, 5vw, 34px)',
  fontWeight: 900,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
};

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 22,
  padding: 'clamp(18px, 4vw, 24px)',
  marginBottom: 20,
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
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
  fontSize: 24,
  fontWeight: 900,
  wordBreak: 'break-word',
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 22,
  fontWeight: 800,
};

const text: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.8,
};

const bodyText: React.CSSProperties = {
  margin: 0,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.9,
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const button: React.CSSProperties = {
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

const primaryButton: React.CSSProperties = {
  padding: '10px 14px',
  border: 'none',
  borderRadius: 12,
  background: '#2563eb',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
  textDecoration: 'none',
  minHeight: 44,
  display: 'inline-flex',
  alignItems: 'center',
};