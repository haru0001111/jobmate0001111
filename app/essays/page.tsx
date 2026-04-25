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

  const [keyword, setKeyword] = useState('');
  const [filterCompanyId, setFilterCompanyId] = useState(companyId);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!editingId) setFormCompanyId(companyId);
    setFilterCompanyId(companyId);
  }, [companyId, editingId]);

  async function refresh() {
    setEssays(await loadItems<Essay>('essays', initialEssays));
  }

  const categories = useMemo(() => {
    return Array.from(new Set(essays.map((e) => e.category))).filter(Boolean);
  }, [essays]);

  const filteredEssays = useMemo(() => {
    return essays.filter((essay) => {
      const keywordTarget = `${essay.title} ${essay.question} ${essay.body} ${essay.companyId} ${essay.category}`.toLowerCase();

      const matchesKeyword = keyword.trim()
        ? keywordTarget.includes(keyword.trim().toLowerCase())
        : true;

      const matchesCompany = filterCompanyId.trim()
        ? essay.companyId === filterCompanyId.trim()
        : true;

      const matchesCategory =
        filterCategory === 'all' ? true : essay.category === filterCategory;

      return matchesKeyword && matchesCompany && matchesCategory;
    });
  }, [essays, keyword, filterCompanyId, filterCategory]);

  function resetFilters() {
    setKeyword('');
    setFilterCompanyId('');
    setFilterCategory('all');
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setFormCompanyId(companyId || filterCompanyId);
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
            {filterCompanyId ? `企業ID ${filterCompanyId} のESを表示中` : '全ESを表示中'} / 保存先: {getSaveMode()}
          </p>
        </div>

        <div style={actions}>
          <Link href="/dashboard" style={ghostButton}>ダッシュボードへ</Link>
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
        <h2 style={sectionTitle}>ESを探す</h2>

        <div style={filterGrid}>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="キーワード検索" style={input} />
          <input value={filterCompanyId} onChange={(e) => setFilterCompanyId(e.target.value)} placeholder="企業IDで絞り込み" style={input} />

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={input}>
            <option value="all">すべてのカテゴリ</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button onClick={resetFilters} style={ghostButton}>絞り込み解除</button>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>{editingId ? 'ESを編集中' : '新しいESを追加'}</h2>

        <div style={formGrid}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" style={input} />
          <input value={formCompanyId} onChange={(e) => setFormCompanyId(e.target.value)} placeholder="企業ID" style={input} />
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
            {editingId && <button onClick={resetForm} style={ghostButton}>キャンセル</button>}
          </div>
        </div>
      </section>

      <section style={card}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>ES一覧</h2>
          <span style={muted}>{filteredEssays.length}件 / 全{essays.length}件</span>
        </div>

        <div style={list}>
          {filteredEssays.map((essay) => (
            <article key={essay.id} style={essayCard}>
              <div style={tagRow}>
                <span style={tag}>企業ID: {essay.companyId}</span>
                <span style={tag}>{essay.category}</span>
              </div>

              <h3 style={essayTitle}>{essay.title}</h3>
              <p style={bodyStyle}>{essay.body}</p>

              <div style={actions}>
                <button onClick={() => startEdit(essay)} style={ghostButton}>編集</button>
                <button onClick={() => deleteEssay(essay.id)} style={dangerButton}>削除</button>
              </div>
            </article>
          ))}

          {filteredEssays.length === 0 && (
            <div style={empty}>条件に合うESはありません。</div>
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

/* スタイルはそのまま */