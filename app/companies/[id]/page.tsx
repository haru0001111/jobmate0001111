'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { getSaveMode, loadItems } from '@/lib/store';

type Company = {
  id: string;
  name: string;
  status: string;
  testType: string;
  portalUrl?: string;
  recruitingUrl?: string;
  loginId?: string;
  loginMemo?: string;
};

type Essay = {
  id: string;
  companyId: string;
  title: string;
  question: string;
  body: string;
  category: string;
};

const initialCompanies: Company[] = [];
const initialEssays: Essay[] = [];

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setCompanies(await loadItems<Company>('companies', initialCompanies));
    setEssays(await loadItems<Essay>('essays', initialEssays));
  }

  const company = useMemo(() => companies.find((c) => c.id === id), [companies, id]);
  const relatedEssays = useMemo(() => essays.filter((e) => e.companyId === id), [essays, id]);

  return (
    <main style={page}>
      <div style={header}>
        <div>
          <p style={muted}>Company Hub / 保存先: {getSaveMode()}</p>
          <h1 style={title}>企業詳細: {company?.name ?? id}</h1>
        </div>

        <div style={actions}>
          <Link href="/dashboard" style={button}>ダッシュボードへ戻る</Link>
          <Link href={`/essays?companyId=${id}`} style={button}>この企業のESを見る</Link>
        </div>
      </div>

      <section style={card}>
        <h2 style={sectionTitle}>基本情報</h2>
        <p><strong>企業ID：</strong>{id}</p>
        <p><strong>会社名：</strong>{company?.name ?? '未登録'}</p>
        <p><strong>ステータス：</strong>{company?.status ?? '未登録'}</p>
        <p><strong>適性検査：</strong>{company?.testType ?? '未登録'}</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>マイページ / 採用ページ</h2>
        <p><strong>マイページURL：</strong>{company?.portalUrl || '未登録'}</p>
        <p><strong>採用ページURL：</strong>{company?.recruitingUrl || '未登録'}</p>
        <p><strong>loginId：</strong>{company?.loginId || '未登録'}</p>
        <p><strong>ログインメモ：</strong>{company?.loginMemo || '未登録'}</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>募集要項</h2>
        <p>職種・勤務地・給与・締切などを企業編集画面で拡張できます。</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>選考フロー</h2>
        <ul>
          <li>ES提出</li>
          <li>Webテスト / 適性検査</li>
          <li>一次面接</li>
          <li>最終面接</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>関連ES</h2>

        {relatedEssays.length === 0 ? (
          <p style={muted}>この企業に紐づくESはまだありません。</p>
        ) : (
          <div style={list}>
            {relatedEssays.map((essay) => (
              <article key={essay.id} style={item}>
                <div style={muted}>{essay.category}</div>
                <h3 style={{ margin: '6px 0 8px' }}>{essay.title}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{essay.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const page: React.CSSProperties = { padding: 24, maxWidth: 960, margin: '0 auto' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 };
const title: React.CSSProperties = { margin: 0, fontSize: 28 };
const muted: React.CSSProperties = { color: '#666', fontSize: 14 };
const card: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const sectionTitle: React.CSSProperties = { margin: '0 0 16px', fontSize: 20, fontWeight: 700 };
const button: React.CSSProperties = { padding: '10px 14px', border: '1px solid #ddd', borderRadius: 10, background: '#fff', color: 'inherit', textDecoration: 'none' };
const actions: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap' };
const list: React.CSSProperties = { display: 'grid', gap: 12 };
const item: React.CSSProperties = { border: '1px solid #eee', borderRadius: 12, padding: 16, background: '#fafafa' };