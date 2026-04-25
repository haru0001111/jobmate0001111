'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSaveMode, loadItems, removeItem, saveItem } from '@/lib/store';

type Essay = {
  id: string;
  companyId: string;
  title: string;
  question: string;
  body: string;
  category: string;
};

const initialEssays: Essay[] = [
  {
    id: 'e1',
    companyId: 'c1',
    title: 'OpenAI向け自己PR',
    question: '自己PRをしてください',
    body: 'AIへの関心と研究経験を軸にした自己PRです。',
    category: '自己PR',
  },
];

function EssaysContent() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId') ?? '';

  const [essays, setEssays] = useState<Essay[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [formCompanyId, setFormCompanyId] = useState(companyId);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('自己PR');
  const [body, setBody] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!editingId) setFormCompanyId(companyId);
  }, [companyId, editingId]);

  async function refresh() {
    setEssays(await loadItems<Essay>('essays', initialEssays));
  }

  const filteredEssays = useMemo(() => {
    return companyId ? essays.filter((e) => e.companyId === companyId) : essays;
  }, [essays, companyId]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setFormCompanyId(companyId);
    setQuestion('');
    setCategory('自己PR');
    setBody('');
  }

  async function saveEssay() {
    if (!title.trim() || !body.trim()) {
      alert('タイトルと本文を入力してね');
      return;
    }

    const essay: Essay = {
      id: editingId ?? `e-${Date.now()}`,
      companyId: formCompanyId || '未設定',
      title,
      question,
      body,
      category,
    };

    setEssays(await saveItem('essays', essay, essays));
    resetForm();
  }

  function startEdit(essay: Essay) {
    setEditingId(essay.id);
    setTitle(essay.title);
    setFormCompanyId(essay.companyId);
    setQuestion(essay.question);
    setCategory(essay.category);
    setBody(essay.body);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteEssay(id: string) {
    if (!confirm('このESを削除する？')) return;
    setEssays(await removeItem('essays', id, essays));
    if (editingId === id) resetForm();
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>JobMate</p>
          <h1 style={titleStyle}>ES管理</h1>
          <p style={muted}>
            {companyId ? `企業ID ${companyId} のESだけ表示中` : '全ESを表示中'} / 保存先: {getSaveMode()}
          </p>
        </div>

        <div style={actions}>
          <Link href="/dashboard" style={ghostButton}>ダッシュボードへ</Link>
          <Link href="/essays" style={ghostButton}>全ESを見る</Link>
        </div>
      </header>

      <section style={statsGrid}>
        <div style={statCard}>
          <div style={statNumber}>{essays.length}</div>
          <div style={muted}>総ES数</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>{filteredEssays.length}</div>
          <div style={muted}>表示中</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>{new Set(essays.map((e) => e.companyId)).size}</div>
          <div style={muted}>関連企業数</div>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>{editingId ? 'ESを編集中' : '新しいESを追加'}</h2>

        <div style={formGrid}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" style={input} />
          <input value={formCompanyId} onChange={(e) => setFormCompanyId(e.target.value)} placeholder="企業ID（例: c1）" style={input} />
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="設問" style={input} />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
            <option>自己PR</option>
            <option>ガクチカ</option>
            <option>志望動機</option>
            <option>強み・弱み</option>
            <option>その他</option>
          </select>

          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="ES本文" rows={8} style={{ ...input, resize: 'vertical' }} />

          <div style={actions}>
            <button onClick={saveEssay} style={primaryButton}>
              {editingId ? '変更を保存' : 'ESを保存'}
            </button>
            {editingId && <button onClick={resetForm} style={ghostButton}>編集をキャンセル</button>}
          </div>
        </div>
      </section>

      <section style={card}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>ES一覧</h2>
          <span style={muted}>{filteredEssays.length}件</span>
        </div>

        <div style={list}>
          {filteredEssays.map((essay) => (
            <article key={essay.id} style={essayCard}>
              <div style={tagRow}>
                <span style={tag}>企業ID: {essay.companyId}</span>
                <span style={tag}>{essay.category}</span>
              </div>

              <h3 style={essayTitle}>{essay.title}</h3>
              {essay.question && <p style={questionStyle}>設問: {essay.question}</p>}
              <p style={bodyStyle}>{essay.body}</p>

              <div style={{ ...actions, marginTop: 14 }}>
                <button onClick={() => startEdit(essay)} style={ghostButton}>編集</button>
                <button onClick={() => deleteEssay(essay.id)} style={dangerButton}>削除</button>
              </div>
            </article>
          ))}

          {filteredEssays.length === 0 && (
            <div style={empty}>この企業に紐づくESはまだありません。</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function EssaysPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>読み込み中...</main>}>
      <EssaysContent />
    </Suspense>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh',
  padding: 32,
  background: '#f6f7fb',
  color: '#111827',
  maxWidth: 1100,
  margin: '0 auto',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'center',
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

const titleStyle: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 32,
  fontWeight: 800,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
};

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
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
  padding: 22,
  marginBottom: 20,
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const sectionHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginBottom: 16,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
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
  fontSize: 14,
  background: '#fff',
};

const primaryButton: React.CSSProperties = {
  padding: '12px 16px',
  border: 'none',
  borderRadius: 12,
  background: '#2563eb',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
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
};

const dangerButton: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #fecaca',
  borderRadius: 12,
  background: '#fff1f2',
  color: '#be123c',
  fontWeight: 700,
  cursor: 'pointer',
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const list: React.CSSProperties = {
  display: 'grid',
  gap: 14,
};

const essayCard: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  padding: 18,
  background: '#fafafa',
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

const essayTitle: React.CSSProperties = {
  margin: '12px 0 8px',
  fontSize: 20,
  fontWeight: 800,
};

const questionStyle: React.CSSProperties = {
  margin: '0 0 8px',
  color: '#6b7280',
  fontSize: 14,
};

const bodyStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  margin: 0,
  lineHeight: 1.7,
  color: '#374151',
};

const empty: React.CSSProperties = {
  border: '1px dashed #d1d5db',
  borderRadius: 16,
  padding: 18,
  color: '#6b7280',
};