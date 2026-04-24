'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadItems, removeItem, saveItem } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

type Company = {
  id: string;
  name: string;
  status: string;
  testType: string;
};

const initialCompanies: Company[] = [
  { id: 'c1', name: 'OpenAI Japan', status: 'interested', testType: 'SPI' },
];

export default function DashboardPage() {
  const { user, login, logout } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('interested');
  const [testType, setTestType] = useState('SPI');

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  async function refresh() {
    setCompanies(await loadItems('companies', user.uid, initialCompanies));
  }

  async function saveCompany() {
    if (!name.trim()) return;

    const company: Company = {
      id: `c-${Date.now()}`,
      name,
      status,
      testType,
    };

    await saveItem('companies', user.uid, company);
    setName('');
    refresh();
  }

  async function deleteCompany(id: string) {
    if (!confirm('削除する？')) return;
    await removeItem('companies', user.uid, id);
    refresh();
  }

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>ダッシュボード</h1>
        <button onClick={login}>Googleでログイン</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>ダッシュボード</h1>
        <button onClick={logout}>ログアウト</button>
      </div>

      <h2>企業追加</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="会社名" />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="interested">興味あり</option>
        <option value="applied">応募済み</option>
      </select>

      <select value={testType} onChange={(e) => setTestType(e.target.value)}>
        <option>SPI</option>
        <option>なし</option>
      </select>

      <button onClick={saveCompany}>追加</button>

      <h2>企業一覧</h2>

      {companies.map((c) => (
        <div key={c.id}>
          {c.name}
          <button onClick={() => deleteCompany(c.id)}>削除</button>
          <Link href={`/companies/${c.id}`}>詳細</Link>
        </div>
      ))}

      <Link href="/essays">ES管理へ</Link>
    </main>
  );
}