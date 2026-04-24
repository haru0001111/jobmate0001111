'use client';

import { useMemo, useState } from 'react';
import type { Company, EssayCategory, EssayEntry } from '@/types';
import { getAuthHeaders } from '@/lib/auth/client-auth-fetch';

const categoryOptions: { value: EssayCategory; label: string }[] = [
  { value: 'gakuchika', label: 'ガクチカ' },
  { value: 'self_pr', label: '自己PR' },
  { value: 'motivation', label: '志望動機' },
  { value: 'strengths', label: '強み・弱み' },
  { value: 'other', label: 'その他' },
];

type FormState = {
  companyId: string;
  category: EssayCategory;
  question: string;
  answerLong: string;
  answer400: string;
  answer300: string;
  answer200: string;
  answer100: string;
  tagsText: string;
};

const initialForm: FormState = {
  companyId: '',
  category: 'gakuchika',
  question: '',
  answerLong: '',
  answer400: '',
  answer300: '',
  answer200: '',
  answer100: '',
  tagsText: '',
};

function toFormState(item?: EssayEntry): FormState {
  if (!item) return initialForm;
  return {
    companyId: item.companyId ?? '',
    category: item.category,
    question: item.question,
    answerLong: item.answerLong,
    answer400: item.answer400 ?? '',
    answer300: item.answer300 ?? '',
    answer200: item.answer200 ?? '',
    answer100: item.answer100 ?? '',
    tagsText: item.tags.join(', '),
  };
}

function normalizeTags(value: string) {
  return value.split(',').map((tag) => tag.trim()).filter(Boolean);
}

export default function EssayManager({
  initialEssays,
  companies,
}: {
  initialEssays: EssayEntry[];
  companies: Company[];
}) {
  const [essays, setEssays] = useState<EssayEntry[]>(initialEssays);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error' | 'saved'>('idle');
  const [message, setMessage] = useState('');

  const companyMap = useMemo(
    () => new Map(companies.map((company) => [company.id, company.name])),
    [companies],
  );

  const sortedEssays = useMemo(
    () => [...essays].sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt)),
    [essays],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(initialForm);
    setStatus('idle');
    setMessage('');
  }

  function startEdit(item: EssayEntry) {
    setEditingId(item.id);
    setForm(toFormState(item));
    setStatus('idle');
    setMessage(`「${item.question}」を編集中`);
  }

  async function handleSave() {
    setStatus('saving');
    setMessage('');

    const payload = {
      companyId: form.companyId || undefined,
      category: form.category,
      question: form.question.trim(),
      answerLong: form.answerLong.trim(),
      answer400: form.answer400.trim() || undefined,
      answer300: form.answer300.trim() || undefined,
      answer200: form.answer200.trim() || undefined,
      answer100: form.answer100.trim() || undefined,
      tags: normalizeTags(form.tagsText),
    };

    try {
      const response = await fetch(editingId ? `/api/essays/${editingId}` : '/api/essays', {
        method: editingId ? 'PUT' : 'POST',
        headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('save_failed');
      const data = await response.json() as { item: EssayEntry; message?: string };

      setEssays((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? data.item : item));
        }
        return [data.item, ...prev];
      });

      setStatus('saved');
      setMessage(data.message ?? '保存しました');
      setEditingId(data.item.id);
      setForm(toFormState(data.item));
    } catch {
      setStatus('error');
      setMessage('保存に失敗しました。API接続を確認してください。');
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm('このESを削除しますか？');
    if (!ok) return;

    try {
      const response = await fetch(`/api/essays/${id}`, { method: 'DELETE', headers: await getAuthHeaders() });
      if (!response.ok) throw new Error('delete_failed');
      setEssays((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) startCreate();
      setStatus('saved');
      setMessage('ESを削除しました');
    } catch {
      setStatus('error');
      setMessage('削除に失敗しました');
    }
  }

  return (
    <main className="container">
      <div className="header">
        <div>
          <span className="badge">ES回答バンク</span>
          <h1>ESの保存・編集</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>
            設問ごとに回答を保存し、100/200/300/400字版までまとめて管理できます。
          </p>
        </div>
        <button className="btn btn-secondary" onClick={startCreate}>+ 新規ES</button>
      </div>

      <section className="grid" style={{ gridTemplateColumns: '1.05fr 0.95fr', alignItems: 'start' }}>
        <div className="card">
          <div className="header">
            <h2>{editingId ? 'ESを編集' : 'ESを追加'}</h2>
            <span className="badge">API保存</span>
          </div>

          <div className="grid" style={{ gap: 14 }}>
            <label>
              紐づける企業
              <select className="select" value={form.companyId} onChange={(e) => update('companyId', e.target.value)}>
                <option value="">企業未設定</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </label>

            <label>
              カテゴリ
              <select className="select" value={form.category} onChange={(e) => update('category', e.target.value as EssayCategory)}>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              設問
              <textarea className="textarea" rows={3} value={form.question} onChange={(e) => update('question', e.target.value)} placeholder="学生時代に力を入れたことを教えてください" />
            </label>

            <label>
              本文（ロング）
              <textarea className="textarea" rows={6} value={form.answerLong} onChange={(e) => update('answerLong', e.target.value)} placeholder="まずは一番長い版を保存" />
            </label>

            <div className="grid grid-3">
              <label>
                400字版
                <textarea className="textarea" rows={5} value={form.answer400} onChange={(e) => update('answer400', e.target.value)} />
              </label>
              <label>
                300字版
                <textarea className="textarea" rows={5} value={form.answer300} onChange={(e) => update('answer300', e.target.value)} />
              </label>
              <label>
                200字版
                <textarea className="textarea" rows={5} value={form.answer200} onChange={(e) => update('answer200', e.target.value)} />
              </label>
            </div>

            <label>
              100字版
              <textarea className="textarea" rows={3} value={form.answer100} onChange={(e) => update('answer100', e.target.value)} />
            </label>

            <label>
              タグ（カンマ区切り）
              <input className="input" value={form.tagsText} onChange={(e) => update('tagsText', e.target.value)} placeholder="アルバイト, リーダー, 改善" />
            </label>

            <div className="row">
              <button className="btn" onClick={handleSave} disabled={status === 'saving'}>
                {status === 'saving' ? '保存中...' : editingId ? '更新する' : '保存する'}
              </button>
              <button className="btn btn-secondary" onClick={startCreate}>フォームをリセット</button>
            </div>

            {message ? (
              <p style={{ color: status === 'error' ? '#b45309' : '#065f46', margin: 0 }}>{message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <div className="header">
              <h2>保存済みES</h2>
              <span className="badge">{sortedEssays.length}件</span>
            </div>

            <div className="list">
              {sortedEssays.map((essay) => (
                <article key={essay.id} className="item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                    <strong>{essay.question}</strong>
                    <span className="badge">{categoryOptions.find((item) => item.value === essay.category)?.label ?? essay.category}</span>
                  </div>
                  {essay.companyId ? (
                    <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 8 }}>対象企業: {companyMap.get(essay.companyId) ?? '未設定'}</p>
                  ) : null}
                  <p style={{ color: '#374151', marginTop: 0 }}>{essay.answer200 || essay.answerLong}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {essay.answer400 ? <span className="badge">400字</span> : null}
                    {essay.answer300 ? <span className="badge">300字</span> : null}
                    {essay.answer200 ? <span className="badge">200字</span> : null}
                    {essay.answer100 ? <span className="badge">100字</span> : null}
                    {essay.tags.map((tag) => <span key={tag} className="badge">#{tag}</span>)}
                  </div>
                  <div className="row">
                    <button className="btn btn-secondary" onClick={() => startEdit(essay)}>編集</button>
                    <button className="btn btn-secondary" onClick={() => handleDelete(essay.id)}>削除</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="header">
              <h2>次にやること</h2>
              <span className="badge">実装順</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Company Hub を開いたときに companyId 一致のESを優先表示</li>
              <li>Chrome拡張で設問候補としてこの企業のESを先に出す</li>
              <li>Firestore へ差し替えるとログイン後も永続化できる</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
