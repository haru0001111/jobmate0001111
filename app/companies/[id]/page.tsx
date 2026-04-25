'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { getSaveMode, loadItems, saveItem } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

type Company = {
  id: string;
  name: string;
  status: string;
  testType: string;
  portalUrl?: string;
  recruitingUrl?: string;
  loginId?: string;
  loginMemo?: string;
  jobDescription?: string;
  selectionFlow?: string;
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

const statusLabel: Record<string, string> = {
  interested: '興味あり',
  applied: '応募済み',
  interview: '面接中',
  offer: '内定',
  rejected: '落選',
};

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, login } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<Company>({
    id,
    name: '',
    status: 'interested',
    testType: 'SPI',
    portalUrl: '',
    recruitingUrl: '',
    loginId: '',
    loginMemo: '',
    jobDescription: '',
    selectionFlow: '',
  });

  useEffect(() => {
    if (user) refresh();
  }, [user, id]);

  async function refresh() {
    if (!user) return;

    const [companyData, essayData] = await Promise.all([
      loadItems<Company>('companies', user.uid, initialCompanies),
      loadItems<Essay>('essays', user.uid, initialEssays),
    ]);

    setCompanies(companyData);
    setEssays(essayData);

    const found = companyData.find((c) => c.id === id);
    if (found) {
      setForm({
        id: found.id,
        name: found.name ?? '',
        status: found.status ?? 'interested',
        testType: found.testType ?? 'SPI',
        portalUrl: found.portalUrl ?? '',
        recruitingUrl: found.recruitingUrl ?? '',
        loginId: found.loginId ?? '',
        loginMemo: found.loginMemo ?? '',
        jobDescription: found.jobDescription ?? '',
        selectionFlow: found.selectionFlow ?? '',
      });
    }
  }

  const company = useMemo(() => companies.find((c) => c.id === id), [companies, id]);
  const relatedEssays = useMemo(() => essays.filter((e) => e.companyId === id), [essays, id]);

  async function saveCompanyDetail() {
    if (!user) return;

    if (!form.name.trim()) {
      alert('会社名を入力してね');
      return;
    }

    await saveItem('companies', user.uid, form);
    setEditing(false);
    refresh();
  }

  function updateForm<K extends keyof Company>(key: K, value: Company[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (!user) {
    return (
      <main style={page}>
        <section style={card}>
          <p style={badge}>JobMate</p>
          <h1 style={title}>ログインが必要です</h1>
          <p style={muted}>企業詳細を見るにはGoogleログインしてください。</p>
          <button onClick={login} style={primaryButton}>Googleでログイン</button>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>Company Hub / 保存先: {getSaveMode()}</p>
          <h1 style={title}>{form.name || company?.name || '企業詳細'}</h1>
          <p style={muted}>企業ID: {id}</p>
        </div>

        <div style={actions}>
          <Link href="/dashboard" style={button}>ダッシュボードへ戻る</Link>
          <Link href={`/essays?companyId=${id}`} style={button}>この企業のESを見る</Link>
          <button onClick={() => setEditing((v) => !v)} style={primaryButton}>
            {editing ? '表示に戻る' : '編集する'}
          </button>
        </div>
      </header>

      {editing ? (
        <>
          <section style={card}>
            <h2 style={sectionTitle}>基本情報を編集</h2>

            <div style={formGrid}>
              <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="会社名" style={input} />

              <select value={form.status} onChange={(e) => updateForm('status', e.target.value)} style={input}>
                <option value="interested">興味あり</option>
                <option value="applied">応募済み</option>
                <option value="interview">面接中</option>
                <option value="offer">内定</option>
                <option value="rejected">落選</option>
              </select>

              <select value={form.testType} onChange={(e) => updateForm('testType', e.target.value)} style={input}>
                <option>SPI</option>
                <option>TG-WEB</option>
                <option>玉手箱</option>
                <option>Web-CAB</option>
                <option>なし</option>
              </select>
            </div>
          </section>

          <section style={card}>
            <h2 style={sectionTitle}>マイページ / 採用ページ</h2>

            <div style={formGrid}>
              <input value={form.portalUrl} onChange={(e) => updateForm('portalUrl', e.target.value)} placeholder="マイページURL" style={input} />
              <input value={form.recruitingUrl} onChange={(e) => updateForm('recruitingUrl', e.target.value)} placeholder="採用ページURL" style={input} />
              <input value={form.loginId} onChange={(e) => updateForm('loginId', e.target.value)} placeholder="ログインID / メール" style={input} />
              <textarea value={form.loginMemo} onChange={(e) => updateForm('loginMemo', e.target.value)} placeholder="ログインメモ" rows={4} style={textarea} />
            </div>
          </section>

          <section style={card}>
            <h2 style={sectionTitle}>募集要項</h2>
            <textarea
              value={form.jobDescription}
              onChange={(e) => updateForm('jobDescription', e.target.value)}
              placeholder="職種・勤務地・給与・締切など"
              rows={8}
              style={textarea}
            />
          </section>

          <section style={card}>
            <h2 style={sectionTitle}>選考フロー</h2>
            <textarea
              value={form.selectionFlow}
              onChange={(e) => updateForm('selectionFlow', e.target.value)}
              placeholder="例：ES提出 → Webテスト → 一次面接 → 最終面接"
              rows={6}
              style={textarea}
            />

            <div style={{ ...actions, marginTop: 16 }}>
              <button onClick={saveCompanyDetail} style={primaryButton}>保存する</button>
              <button onClick={() => setEditing(false)} style={button}>キャンセル</button>
            </div>
          </section>
        </>
      ) : (
        <>
          <section style={card}>
            <h2 style={sectionTitle}>基本情報</h2>
            <p><strong>会社名：</strong>{company?.name ?? '未登録'}</p>
            <p><strong>ステータス：</strong>{statusLabel[company?.status ?? ''] ?? company?.status ?? '未登録'}</p>
            <p><strong>適性検査：</strong>{company?.testType ?? '未登録'}</p>
          </section>

          <section style={card}>
            <h2 style={sectionTitle}>マイページ / 採用ページ</h2>
            <p><strong>マイページURL：</strong>{company?.portalUrl ? <a href={company.portalUrl} target="_blank">開く</a> : '未登録'}</p>
            <p><strong>採用ページURL：</strong>{company?.recruitingUrl ? <a href={company.recruitingUrl} target="_blank">開く</a> : '未登録'}</p>
            <p><strong>loginId：</strong>{company?.loginId || '未登録'}</p>
            <p><strong>ログインメモ：</strong>{company?.loginMemo || '未登録'}</p>
          </section>

          <section style={card}>
            <h2 style={sectionTitle}>募集要項</h2>
            <p style={preText}>{company?.jobDescription || '未登録'}</p>
          </section>

          <section style={card}>
            <h2 style={sectionTitle}>選考フロー</h2>
            <p style={preText}>{company?.selectionFlow || '未登録'}</p>
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
                    <Link href={`/essays/${essay.id}`} style={button}>ES詳細を見る</Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'clamp(16px, 4vw, 32px)',
  maxWidth: 960,
  margin: '0 auto',
  background: '#f6f7fb',
  color: '#111827',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 24,
  alignItems: 'flex-start',
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

const card: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 22,
  padding: 'clamp(18px, 4vw, 24px)',
  background: '#fff',
  marginBottom: 20,
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: 22,
  fontWeight: 800,
};

const formGrid: React.CSSProperties = {
  display: 'grid',
  gap: 12,
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 12,
  fontSize: 16,
  minHeight: 44,
};

const textarea: React.CSSProperties = {
  ...input,
  resize: 'vertical',
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

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const list: React.CSSProperties = {
  display: 'grid',
  gap: 12,
};

const item: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 16,
  background: '#fafafa',
};

const preText: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  lineHeight: 1.8,
  margin: 0,
};