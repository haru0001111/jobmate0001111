'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type PublicCompanyInsight = {
  id: string;
  companyName: string;
  salary?: string;
  holidays?: string;
  location?: string;
  benefits?: string;
  workStyle?: string;
  testType?: string;
  difficulty?: string;
  createdAt: number;
};

export default function InsightsPage() {
  const [items, setItems] = useState<PublicCompanyInsight[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const q = query(
      collection(db, 'publicCompanyInsights'),
      orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);
    setItems(snap.docs.map((d) => d.data() as PublicCompanyInsight));
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>JobMate</p>
          <h1 style={title}>みんなの企業データ</h1>
          <p style={muted}>
            ユーザーが入力した企業情報を匿名化して集計しています。
          </p>
        </div>

        <Link href="/dashboard" style={button}>
          ダッシュボードへ
        </Link>
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>投稿された企業情報</h2>

        {items.length === 0 ? (
          <p style={muted}>まだデータがありません。</p>
        ) : (
          <div style={list}>
            {items.map((item) => (
              <article key={item.id} style={itemCard}>
                <h3 style={companyName}>{item.companyName}</h3>

                <div style={grid}>
                  <Info label="初任給" value={item.salary} />
                  <Info label="年間休日" value={item.holidays} />
                  <Info label="勤務地" value={item.location} />
                  <Info label="福利厚生" value={item.benefits} />
                  <Info label="働き方" value={item.workStyle} />
                  <Info label="適性検査" value={item.testType} />
                  <Info label="選考難易度" value={item.difficulty} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div style={infoBox}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value || '未登録'}</div>
    </div>
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
  flexWrap: 'wrap',
  alignItems: 'flex-start',
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
  fontSize: 'clamp(28px, 5vw, 36px)',
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
  padding: 'clamp(16px, 4vw, 22px)',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: 22,
  fontWeight: 800,
};

const list: React.CSSProperties = {
  display: 'grid',
  gap: 14,
};

const itemCard: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  padding: 18,
  background: '#fafafa',
};

const companyName: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: 20,
  fontWeight: 900,
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 10,
};

const infoBox: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 14,
  padding: 12,
};

const infoLabel: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 12,
  fontWeight: 700,
};

const infoValue: React.CSSProperties = {
  marginTop: 4,
  fontWeight: 800,
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