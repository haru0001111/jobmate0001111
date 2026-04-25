'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadItems, removeItem, saveItem } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

type JobEvent = {
  id: string;
  companyId: string;
  title: string;
  type: string;
  startAt: string;
  memo: string;
};

type Company = {
  id: string;
  name: string;
};

const initialEvents: JobEvent[] = [];
const initialCompanies: Company[] = [];

const eventTypeLabel: Record<string, string> = {
  seminar: '説明会',
  interview: '面接',
  es: 'ES締切',
  test: 'Webテスト',
  other: 'その他',
};

export default function EventsPage() {
  const { user, login } = useAuth();

  const [events, setEvents] = useState<JobEvent[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [type, setType] = useState('interview');
  const [startAt, setStartAt] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  async function refresh() {
    if (!user) return;

    const [eventData, companyData] = await Promise.all([
      loadItems<JobEvent>('events', user.uid, initialEvents),
      loadItems<Company>('companies', user.uid, initialCompanies),
    ]);

    setEvents(eventData);
    setCompanies(companyData);
  }

  const companyNameMap = useMemo(() => {
    return new Map(companies.map((c) => [c.id, c.name]));
  }, [companies]);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  }, [events]);

  async function saveEvent() {
    if (!user) return;

    if (!title.trim() || !startAt) {
      alert('タイトルと日時を入力してね');
      return;
    }

    const event: JobEvent = {
      id: `event-${Date.now()}`,
      companyId,
      title,
      type,
      startAt,
      memo,
    };

    setEvents(await saveItem('events', user.uid, event));

    setTitle('');
    setCompanyId('');
    setType('interview');
    setStartAt('');
    setMemo('');
  }

  async function deleteEvent(id: string) {
    if (!user) return;
    if (!confirm('削除する？')) return;

    setEvents(await removeItem('events', user.uid, id));
  }

  if (!user) {
    return (
      <main style={page}>
        <h1>ログインが必要です</h1>
        <button onClick={login}>Googleでログイン</button>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <h1>日程管理</h1>
        <Link href="/dashboard">戻る</Link>
      </header>

      <section style={card}>
        <h2>予定追加</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          style={input}
        />

        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          style={input}
        >
          <option value="">企業選択</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={input}
        >
          <option value="seminar">説明会</option>
          <option value="interview">面接</option>
          <option value="es">ES締切</option>
          <option value="test">テスト</option>
          <option value="other">その他</option>
        </select>

        <input
          type="datetime-local"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          style={input}
        />

        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモ"
          style={input}
        />

        <button onClick={saveEvent} style={button}>
          追加
        </button>
      </section>

      <section style={card}>
        <h2>予定一覧</h2>

        {sortedEvents.length === 0 && <p>予定がありません</p>}

        {sortedEvents.map((e) => (
          <div key={e.id} style={eventCard}>
            <div>
              <strong>{e.title}</strong>
              <div>{eventTypeLabel[e.type]}</div>
              <div>{e.startAt}</div>
              <div>{companyNameMap.get(e.companyId)}</div>
              <div>{e.memo}</div>
            </div>

            <button onClick={() => deleteEvent(e.id)}>削除</button>
          </div>
        ))}
      </section>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: 24,
  maxWidth: 800,
  margin: '0 auto',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 20,
};

const card: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: 16,
  marginBottom: 20,
};

const input: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginBottom: 10,
  padding: 8,
};

const button: React.CSSProperties = {
  padding: 10,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
};

const eventCard: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: 10,
  marginBottom: 10,
};