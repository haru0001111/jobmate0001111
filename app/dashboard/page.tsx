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

const initialCompanies: Company[] = [];

const statusLabel: Record<string, string> = {
  interested: '興味あり',
  applied: '応募済み',
  waiting: '結果待ち',
  interview: '面接中',
  offer: '内定',
  rejected: '落選',
};

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
    if (!name.trim()) {
      alert('会社名を入力してね');
      return;
    }

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
      <main className="min-h-screen flex items-center justify-center px-6">
        <section className="max-w-xl w-full bg-white/90 backdrop-blur border border-gray-200 rounded-3xl p-10 shadow-xl">
          <p className="text-sm font-bold text-indigo-600">JobMate</p>
          <h1 className="text-4xl font-black mt-2 leading-tight">
            就活管理を、<br />もっとシンプルに。
          </h1>
          <p className="text-gray-500 mt-4 leading-relaxed">
            企業・ES・日程・選考状況を一元管理できる就活アプリ
          </p>

          <button
            onClick={login}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            Googleでログイン
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 max-w-6xl mx-auto">

      {/* HEADER */}
      <header className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <p className="text-sm text-indigo-600 font-bold">JobMate</p>
          <h1 className="text-3xl font-black mt-1">ダッシュボード</h1>
          <p className="text-gray-500 text-sm">
            企業・ES・日程をまとめて管理
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/events" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">
            日程管理
          </Link>
          <button onClick={logout} className="border px-4 py-2 rounded-xl">
            ログアウト
          </button>
        </div>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-3xl font-black">{companies.length}</div>
          <div className="text-gray-500 text-sm">登録企業</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-3xl font-black">
            {companies.filter(c => c.status === 'applied' || c.status === 'interview').length}
          </div>
          <div className="text-gray-500 text-sm">選考中</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-3xl font-black">
            {companies.filter(c => c.status === 'offer').length}
          </div>
          <div className="text-gray-500 text-sm">内定</div>
        </div>
      </section>

      {/* ADD */}
      <section className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="font-bold text-lg mb-4">企業を追加</h2>

        <div className="grid md:grid-cols-4 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="会社名"
            className="border rounded-xl px-3 py-2"
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-xl px-3 py-2">
            <option value="interested">興味あり</option>
            <option value="applied">応募済み</option>
            <option value="waiting">結果待ち</option>
            <option value="interview">面接中</option>
            <option value="offer">内定</option>
            <option value="rejected">落選</option>
          </select>

          <select value={testType} onChange={(e) => setTestType(e.target.value)} className="border rounded-xl px-3 py-2">
            <option>SPI</option>
            <option>TG-WEB</option>
            <option>玉手箱</option>
            <option>Web-CAB</option>
            <option>なし</option>
          </select>

          <button onClick={saveCompany} className="bg-blue-600 text-white rounded-xl font-bold">
            追加
          </button>
        </div>
      </section>

      {/* LIST */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">企業一覧</h2>

          <div className="flex gap-2">
            <Link href="/events" className="border px-3 py-2 rounded-xl">日程</Link>
            <Link href="/essays" className="border px-3 py-2 rounded-xl">ES</Link>
          </div>
        </div>

        <div className="space-y-3">
          {companies.map((c) => (
            <div key={c.id} className="flex justify-between items-center border p-4 rounded-xl bg-gray-50">
              <div>
                <div className="font-bold">{c.name}</div>
                <div className="text-sm text-gray-500">
                  {statusLabel[c.status]} / {c.testType}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/companies/${c.id}`} className="border px-3 py-1 rounded-lg">
                  詳細
                </Link>
                <button onClick={() => deleteCompany(c.id)} className="text-red-600">
                  削除
                </button>
              </div>
            </div>
          ))}

          {companies.length === 0 && (
            <div className="text-gray-500 text-sm">
              まだ企業がありません
            </div>
          )}
        </div>
      </section>
    </main>
  );
}