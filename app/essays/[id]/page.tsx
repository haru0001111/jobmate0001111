'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { loadItems } from '@/lib/store';

type Essay = {
  id: string;
  companyId: string;
  title: string;
  question: string;
  body: string;
  category: string;
};

const initialEssays: Essay[] = [];

export default function EssayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [essay, setEssay] = useState<Essay | null>(null);

  useEffect(() => {
    async function load() {
      const essays = await loadItems<Essay>('essays', initialEssays);
      setEssay(essays.find((e) => e.id === id) ?? null);
    }

    load();
  }, [id]);

  if (!essay) {
    return (
      <main style={page}>
        <section style={card}>
          <h1>ESが見つかりません</h1>
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
          <p style={muted}>企業ID: {essay.companyId} / {essay.category}</p>
        </div>

        <Link href="/essays" style={button}>ES一覧へ戻る</Link>
      </header>

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