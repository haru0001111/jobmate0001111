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
    return [...events].sort((a, b) => {
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    });
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
    if (!confirm('この予定を削除する？')) return;

    setEvents(await removeItem('events', user.uid, id));
  }

  if (!user) {
    return (
      <main style={page}>
        <section style={card}>
          <p style={badge}>JobMate</p>
          <h1 style={titleStyle}>ログインが必要です</h1>
          <p style={muted}>日程管理を使うにはGoogleログインしてください。</p>
          <button onClick={login} style={primaryButton}>Googleでログイン</button>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>JobMate</p>
          <h1 style={titleStyle}>日程管理</h1>
          <p style={muted}>説明会・面接・ES締切・Webテストをまとめて管理</p>
        </div>

        <div style={actions}>
          <Link href="/dashboard" style={ghostButton}>ダッシュボードへ</Link>
          <Link href="/essays" style={ghostButton}>ES管理へ</Link>
        </div>
      </header>

      <section style={statsGrid}>
        <div style={statCard}>
          <div style={statNumber}>{events.length}</div>
          <div style={muted}>登録予定</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>
            {events.filter((e) => new Date(e.startAt).getTime() >= Date.now()).length}
          </div>
          <div style={muted}>今後の予定</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>
            {events.filter((e) => e.type === 'interview').length}
          </div>
          <div style={muted}>面接</div>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>予定を追加</h2>

        <div style={formGrid}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="予定タイトル（例：一次面接）"
            style={input}
          />

          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} style={input}>
            <option value="">企業を選択（任意）</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
            <option value="seminar">説明会</option>
            <option value="interview">面接</option>
            <option value="es">ES締切</option>
            <option value="test">Webテスト</option>
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
            placeholder="メモ（持ち物・URL・面接官・注意点など）"
            rows={4}
            style={textarea}
          />

          <button onClick={saveEvent} style={primaryButton}>予定を追加</button>
        </div>
      </section>

      <section style={card}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>予定一覧</h2>
          <span style={muted}>{sortedEvents.length}件</span>
        </div>

        <div style={list}>
          {sortedEvents.map((event) => (
            <article key={event.id} style={eventCard}>
              <div>
                <div style={tagRow}>
                  <span style={tag}>{eventTypeLabel[event.type] ?? event.type}</span>
                  {event.companyId && (
                    <span style={tag}>
                      {companyNameMap.get(event.companyId) ?? event.companyId}
                    </span>
                  )}
                </div>

                <h3 style={eventTitle}>{event.title}</h3>
                <p style={muted}>{formatDate(event.startAt)}</p>
                {event.memo && <p style={memoText}>{event.memo}</p>}
              </div>

              <button onClick={() => deleteEvent(event.id)} style={dangerButton}>削除</button>
            </article>
          ))}

          {sortedEvents.length === 0 && (
            <div style={empty}>まだ予定がありません。説明会や面接の日程を追加してね。</div>
          )}
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  if (!value) return '日時未設定';

  const date = new Date(value);

  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
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
  fontWeight: 900,
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

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 12,
  fontSize: 16,
  background: '#fff',
  minHeight: 44,
};

const textarea: React.CSSProperties = {
  ...input,
  resize: 'vertical',
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

const eventCard: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  padding: 18,
  background: '#fafafa',
  flexWrap: 'wrap',
};

const eventTitle: React.CSSProperties = {
  margin: '12px 0 8px',
  fontSize: 20,
  fontWeight: 800,
};

const tagRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const tag: React.CSSPr