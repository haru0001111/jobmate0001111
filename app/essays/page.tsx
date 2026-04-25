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

type Company = {
  id: string;
  name: string;
  status?: string;
  testType?: string;
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

const initialCompanies: Company[] = [
  { id: 'c1', name: 'OpenAI Japan', status: 'interested', testType: 'SPI' },
];

function EssaysContent() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId') ?? '';

  const [essays, setEssays] = useState<Essay[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
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
    const [essayData, companyData] = await Promise.all([
      loadItems<Essay>('essays', initialEssays),
      loadItems<Company>('companies', initialCompanies),
    ]);

    setEssays(essayData);
    setCompanies(companyData);
  }

  const companyNameMap = useMemo(() => {
    return new Map(companies.map((company) => [company.id, company.name]));
  }, [companies]);

  function getCompanyName(id: string) {
    return companyNameMap.get(id) ?? id;
  }

  const categories = useMemo(() => {
    return Array.from(new Set(essays.map((e) => e.category))).filter(Boolean);
  }, [essays]);

  const filteredEssays = useMemo(() => {
    return essays.filter((essay) => {
      const companyName = getCompanyName(essay.companyId);

      const keywordTarget = `${essay.title} ${essay.question} ${essay.body} ${essay.companyId} ${companyName} ${essay.category}`.toLowerCase();

      const matchesKeyword = keyword.trim()
        ? keywordTarget.includes(keyword.trim().toLowerCase())
        : true;

      const matchesCompany = filterCompanyId.trim()
        ? essay.companyId === filterCompanyId.trim() ||
          companyName.toLowerCase().includes(filterCompanyId.trim().toLowerCase())
        : true;

      const matchesCategory =
        filterCategory === 'all' ? true : essay.category === filterCategory;

      return matchesKeyword && matchesCompany && matchesCategory;
    });
  }, [essays, keyword, filterCompanyId, filterCategory, companyNameMap]);

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
            {filterCompanyId ? `${getCompanyName(filterCompanyId)} のESを表示中` : '全ESを表示中'} / 保存先: {getSaveMode()}
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
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="キーワード検索（タイトル・設問・本文・企業名）"
            style={input}
          />

          <input
            value={filterCompanyId}
            onChange={(e) => setFilterCompanyId(e.target.value)}
            placeholder="企業名 or 企業IDで絞り込み"
            style={input}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={input}
          >
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

          <select value={formCompanyId} onChange={(e) => setFormCompanyId(e.target.value)} style={input}>
            <option value="">企業を選択</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

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
          <span style={muted}>{filteredEssays.length}件 / 全{essays.length}件</span>
        </div>

        <div style={list}>
          {filteredEssays.map((essay) => (
            <article key={essay.id} style={essayCard}>
              <div style={tagRow}>
                <span style={tag}>{getCompanyName(essay.companyId)}</span>
                <span style={tag}>{essay.category}</span>
              </div>

              <h3 style={essayTitle}>{essay.title}</h3>
              {essay.question && <p style={questionStyle}>設問: {essay.question}</p>}
              <p style={bodyStyle}>{essay.body}</p>

              <div style={{ ...actions, marginTop: 14 }}>
　　　　　　　　<Link href={`/essays/${essay.id}`} style={ghostButton}>詳細</Link>
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
  fontSize: 'clamp(26px, 5vw, 32px)',
  fontWeight: 800,
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
  gap: 12,
};

const filterGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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