'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

export default function EssaysPage() {
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
      <div style={header}>
        <div>
          <p style={muted}>保存先: {getSaveMode()}</p>
          <h1 style={titleStyle}>ES管理</h1>
          <p style={muted}>
            {companyId ? `企業ID ${companyId} のESだけ表示中` : '全ESを表示中'}
          </p>
        </div>

        <div style={actions}>
          <Link href="/dashboard" style={button}>ダッシュボードへ</Link>
          <Link href="/essays" style={button}>全ESを見る</Link>
        </div>
      </div>

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
            <button onClick={saveEssay} style={button}>
              {editingId ? '変更を保存' : 'ESを保存'}
            </button>
            {editingId && <button onClick={resetForm} style={button}>編集をキャンセル</button>}
          </div>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>ES一覧</h2>

        <div style={list}>
          {filteredEssays.map((essay) => (
            <article key={essay.id} style={item}>
              <div style={actions}>
                <span style={tag}>企業ID: {essay.companyId}</span>
                <span style={tag}>{essay.category}</span>
              </div>

              <h3 style={{ margin: '10px 0 8px', fontSize: 20 }}>{essay.title}</h3>
              {essay.question && <p style={muted}>設問: {essay.question}</p>}
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{essay.body}</p>

              <div style={{ ...actions, marginTop: 12 }}>
                <button onClick={() => startEdit(essay)} style={button}>編集</button>
                <button onClick={() => deleteEssay(essay.id)} style={button}>削除</button>
              </div>
            </article>
          ))}

          {filteredEssays.length === 0 && (
            <div style={item}>この企業に紐づくESはまだありません。</div>
          )}
        </div>
      </section>
    </main>
  );
}

const page: React.CSSProperties = { padding: 24, maxWidth: 960, margin: '0 auto' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: 28 };
const muted: React.CSSProperties = { color: '#666', fontSize: 14 };
const card: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const sectionTitle: React.CSSProperties = { margin: '0 0 16px', fontSize: 20, fontWeight: 700 };
const formGrid: React.CSSProperties = { display: 'grid', gap: 12 };
const input: React.CSSProperties = { width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 10 };
const button: React.CSSProperties = { padding: '10px 14px', border: '1px solid #ddd', borderRadius: 10, background: '#fff', color: 'inherit', textDecoration: 'none', cursor: 'pointer' };
const list: React.CSSProperties = { display: 'grid', gap: 16 };
const item: React.CSSProperties = { border: '1px solid #eee', borderRadius: 12, padding: 16, background: '#fafafa' };
const actions: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap' };
const tag: React.CSSProperties = { padding: '4px 8px', borderRadius: 999, background: '#eee', fontSize: 12, color: '#555' };