'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadItems } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

type Company = {
  id: string;
  name: string;
  status: string;
  testType: string;
  salary?: string;
  holidays?: string;
  location?: string;
  benefits?: string;
  workStyle?: string;
  priority?: string;
  difficulty?: string;
};

const initialCompanies: Company[] = [];

const compareFields: { key: keyof Company; label: string }[] = [
  { key: 'salary', label: '初任給' },
  { key: 'holidays', label: '年間休日' },
  { key: 'location', label: '勤務地' },
  { key: 'benefits', label: '福利厚生' },
  { key: 'workStyle', label: '働き方' },
  { key: 'testType', label: '適性検査' },
  { key: 'status', label: '選考状況' },
  { key: 'priority', label: '志望度' },
  { key: 'difficulty', label: '選考難易度' },
];

export default function ComparePage() {
  const { user, login } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<(keyof Company)[]>(
    compareFields.map((f) => f.key)
  );

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  async function refresh() {
    if (!user) return;
    setCompanies(await loadItems<Company>('companies', user.uid, initialCompanies));
  }

  const selectedCompanies = useMemo(() => {
    return companies.filter((company) => selectedIds.includes(company.id));
  }, [companies, selectedIds]);

  function toggleCompany(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  function toggleField(key: keyof Company) {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
    );
  }

  if (!user) {
    return (
      <main style={page}>
        <section style={card}>
          <h1>ログインが必要です</h1>
          <p style={muted}>企業比較を使うにはログインしてください。</p>
          <button onClick={login} style={primaryButton}>ログイン</button>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>JobMate</p>
          <h1 style={title}>企業比較</h1>
          <p style={muted}>初任給・年間休日・勤務地などを横並びで比較できます。</p>
        </div>

        <Link href="/dashboard" style={button}>ダッシュボードへ</Link>
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>比較する企業を選択</h2>

        <div style={checkGrid}>
          {companies.map((company) => (
            <label key={company.id} style={checkItem}>
              <input
                type="checkbox"
                checked={selectedIds.includes(company.id)}
                onChange={() => toggleCompany(company.id)}
              />
              {company.name}
            </label>
          ))}
        </div>

        {companies.length === 0 && (
          <p style={muted}>まだ企業がありません。先にダッシュボードで企業を追加してね。</p>
        )}
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>比較項目を選択</h2>

        <div style={checkGrid}>
          {compareFields.map((field) => (
            <label key={field.key} style={checkItem}>
              <input
                type="checkbox"
                checked={selectedFields.includes(field.key)}
                onChange={() => toggleField(field.key)}
              />
              {field.label}
            </label>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>比較表</h2>

        {selectedCompanies.length === 0 ? (
          <p style={muted}>比較する企業を選択してください。</p>
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>項目</th>
                  {selectedCompanies.map((company) => (
                    <th key={company.id} style={th}>{company.name}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {compareFields
                  .filter((field) => selectedFields.includes(field.key))
                  .map((field) => (
                    <tr key={field.key}>
                      <td style={tdStrong}>{field.label}</td>
                      {selectedCompanies.map((company) => (
                        <td key={company.id} style={td}>
                          {company[field.key] || '未登録'}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'clamp(16px, 4vw, 32px)',
  maxWidth: 1100,
  margin: '0 auto',
  background: '#f6f7fb',
  color: '#111827',
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
  marginBottom: 20,
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: 22,
  fontWeight: 800,
};

const checkGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 10,
};

const checkItem: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  padding: 12,
  border: '1px solid #e5e7eb',
  borderRadius: 14,
  background: '#fafafa',
  fontWeight: 700,
};

const tableWrap: React.CSSProperties = {
  overflowX: 'auto',
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 680,
};

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: 14,
  borderBottom: '1px solid #e5e7eb',
  background: '#f8fafc',
  fontWeight: 900,
};

const td: React.CSSProperties = {
  padding: 14,
  borderBottom: '1px solid #e5e7eb',
  whiteSpace: 'pre-wrap',
};

const tdStrong: React.CSSProperties = {
  ...td,
  fontWeight: 900,
  color: '#374151',
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
  ...button,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
};