'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadItems, removeItem, saveItem } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';
import { savePublicCompanyInsight } from '@/lib/publicCompanyInsights';

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

const statusLabel: Record<string, string> = {
  interested: '興味あり',
  applied: '応募済み',
  waiting: '結果待ち',
  interview: '面接中',
  offer: '内定',
  rejected: '落選',
};

export default function DashboardPage() {
  const {
    user,
    login,
    logout,
    loginWithEmail,
    register,
    sendMagicLink,
  } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [status, setStatus] = useState('interested');
  const [testType, setTestType] = useState('SPI');
  const [salary, setSalary] = useState('');
  const [holidays, setHolidays] = useState('');
  const [location, setLocation] = useState('');
  const [benefits, setBenefits] = useState('');
  const [workStyle, setWorkStyle] = useState('');
  const [priority, setPriority] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  async function refresh() {
    setCompanies(await loadItems('companies', user.uid, initialCompanies));
  }

  function clearForm() {
    setEditingId(null);
    setName('');
    setStatus('interested');
    setTestType('SPI');
    setSalary('');
    setHolidays('');
    setLocation('');
    setBenefits('');
    setWorkStyle('');
    setPriority('');
    setDifficulty('');
  }

  function startEdit(company: Company) {
    setEditingId(company.id);
    setName(company.name || '');
    setStatus(company.status || 'interested');
    setTestType(company.testType || 'SPI');
    setSalary(company.salary || '');
    setHolidays(company.holidays || '');
    setLocation(company.location || '');
    setBenefits(company.benefits || '');
    setWorkStyle(company.workStyle || '');
    setPriority(company.priority || '');
    setDifficulty(company.difficulty || '');
  }

  async function saveCompany() {
    if (!name.trim()) {
      alert('会社名を入力してね');
      return;
    }

    const company: Company = {
      id: editingId || `c-${Date.now()}`,
      name,
      status,
      testType,
      salary,
      holidays,
      location,
      benefits,
      workStyle,
      priority,
      difficulty,
    };

    await saveItem('companies', user.uid, company);
    await savePublicCompanyInsight({
     companyName: name,
     salary,
     holidays,
     location,
     benefits,
     workStyle,
     testType,
     difficulty,
   });
    clearForm();
    refresh();
  }

  async function deleteCompany(id: string) {
    if (!confirm('削除する？')) return;
    await removeItem('companies', user.uid, id);

    if (editingId === id) {
      clearForm();
    }

    refresh();
  }

  async function handleEmailLogin() {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してね');
      return;
    }

    try {
      await loginWithEmail(email, password);
    } catch {
      alert('メールログインに失敗しました');
    }
  }

  async function handleRegister() {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してね');
      return;
    }

    try {
      await register(email, password);
    } catch {
      alert('新規登録に失敗しました');
    }
  }

  async function handleMagicLink() {
    if (!email) {
      alert('メールアドレスを入力してね');
      return;
    }

    try {
      await sendMagicLink(email);
    } catch {
      alert('メールリンク送信に失敗しました');
    }
  }

  if (!user) {
    return (
      <main style={landingPage}>
        <section style={heroCard}>
          <p style={badge}>JobMate</p>
          <h1 style={heroTitle}>
            就活管理を、<br />
            もっとシンプルに。
          </h1>
          <p style={heroText}>
            企業管理、ES管理、日程管理、選考状況をひとつにまとめて、就活の進捗を見える化できます。
          </p>

          <div style={heroFeatures}>
            <span style={featureItem}>企業管理</span>
            <span style={featureItem}>ES管理</span>
            <span style={featureItem}>日程管理</span>
            <span style={featureItem}>選考ステータス</span>
          </div>

          <div style={loginBox}>
            <button onClick={login} style={primaryButton}>Googleでログイン</button>

            <div style={divider}>または</div>

            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" style={input} />

            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" style={input} />

            <div style={actions}>
              <button onClick={handleEmailLogin} style={primaryButton}>メールでログイン</button>
              <button onClick={handleRegister} style={ghostButton}>新規登録</button>
            </div>

            <button onClick={handleMagicLink} style={ghostButton}>
              パスワードなしでメールリンクログイン
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <header style={header}>
        <div>
          <p style={badge}>JobMate</p>
          <h1 style={title}>ダッシュボード</h1>
          <p style={muted}>企業・ES・日程・選考状況をまとめて管理</p>
        </div>

        <div style={actions}>
          <Link href="/events" style={primaryButton}>日程管理へ</Link>
          <Link href="/insights" style={ghostButton}>みんなの企業データへ</Link>
          <button onClick={logout} style={ghostButton}>ログアウト</button>
        </div>
      </header>

      <section style={statsGrid}>
        <div style={statCard}>
          <div style={statNumber}>{companies.length}</div>
          <div style={muted}>登録企業</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>
            {companies.filter((c) => c.status === 'applied' || c.status === 'interview').length}
          </div>
          <div style={muted}>選考中</div>
        </div>
        <div style={statCard}>
          <div style={statNumber}>{companies.filter((c) => c.status === 'offer').length}</div>
          <div style={muted}>内定</div>
        </div>
      </section>

      <section style={card}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>{editingId ? '企業を編集' : '企業を追加'}</h2>
          {editingId && (
            <button onClick={clearForm} style={ghostButton}>
              編集をキャンセル
            </button>
          )}
        </div>

        <div style={formGrid}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="会社名" style={input} />

          <select value={status} onChange={(e) => setStatus(e.target.value)} style={input}>
            <option value="interested">興味あり</option>
            <option value="applied">応募済み</option>
            <option value="waiting">結果待ち</option>
            <option value="interview">面接中</option>
            <option value="offer">内定</option>
            <option value="rejected">落選</option>
          </select>

          <select value={testType} onChange={(e) => setTestType(e.target.value)} style={input}>
            <option>SPI</option>
            <option>TG-WEB</option>
            <option>玉手箱</option>
            <option>Web-CAB</option>
            <option>その他</option>
            <option>なし</option>
          </select>

          <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="初任給（例：25万円）" style={input} />
          <input value={holidays} onChange={(e) => setHolidays(e.target.value)} placeholder="年間休日（例：120日）" style={input} />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="勤務地（例：東京・大阪）" style={input} />
          <input value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="福利厚生（例：住宅補助あり）" style={input} />
          <input value={workStyle} onChange={(e) => setWorkStyle(e.target.value)} placeholder="働き方（例：リモート可）" style={input} />
          <input value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="志望度（例：高・中・低）" style={input} />
          <input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="選考難易度（例：高・中・低）" style={input} />

          <button onClick={saveCompany} style={primaryButton}>
            {editingId ? '更新する' : '追加する'}
          </button>
        </div>
      </section>

      <section style={card}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>企業一覧</h2>

          <div style={actions}>
            <Link href="/events" style={ghostButton}>日程管理へ</Link>
            <Link href="/essays" style={ghostButton}>ES管理へ</Link>
            <Link href="/compare" style={ghostButton}>企業比較へ</Link>
          </div>
        </div>

        <div style={list}>
          {companies.map((c) => (
            <article key={c.id} style={companyCard}>
              <div>
                <h3 style={companyName}>{c.name}</h3>
                <div style={tagRow}>
                  <span style={tag}>{statusLabel[c.status] ?? c.status}</span>
                  <span style={tag}>{c.testType}</span>
                  {c.salary && <span style={tag}>{c.salary}</span>}
                  {c.holidays && <span style={tag}>{c.holidays}</span>}
                </div>
              </div>

              <div style={actions}>
                <button onClick={() => startEdit(c)} style={ghostButton}>編集</button>
                <Link href={`/companies/${c.id}`} style={ghostButton}>詳細</Link>
                <button onClick={() => deleteCompany(c.id)} style={dangerButton}>削除</button>
              </div>
            </article>
          ))}

          {companies.length === 0 && (
            <div style={empty}>まだ企業がありません。上のフォームから追加してね。</div>
          )}
        </div>
      </section>
    </main>
  );
}

const landingPage: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'clamp(20px, 5vw, 48px)',
  background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
  color: '#111827',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

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

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 'clamp(26px, 5vw, 32px)',
  fontWeight: 800,
};

const heroCard: React.CSSProperties = {
  width: '100%',
  maxWidth: 920,
  border: '1px solid #e5e7eb',
  borderRadius: 28,
  padding: 'clamp(28px, 7vw, 56px)',
  background: 'rgba(255, 255, 255, 0.92)',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.10)',
};

const heroTitle: React.CSSProperties = {
  margin: '14px 0 12px',
  fontSize: 'clamp(32px, 7vw, 52px)',
  lineHeight: 1.15,
  fontWeight: 900,
  letterSpacing: '-0.04em',
};

const heroText: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 'clamp(15px, 2vw, 17px)',
  marginBottom: 22,
  lineHeight: 1.8,
  maxWidth: 680,
};

const heroFeatures: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginBottom: 24,
};

const featureItem: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 999,
  background: '#f1f5f9',
  color: '#334155',
  fontSize: 13,
  fontWeight: 800,
};

const loginBox: React.CSSProperties = {
  display: 'grid',
  gap: 10,
  maxWidth: 460,
};

const divider: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 13,
  fontWeight: 700,
  textAlign: 'center',
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
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
  textDecoration: 'none',
  minHeight: 44,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  justifyContent: 'center',
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

const list: React.CSSProperties = {
  display: 'grid',
  gap: 12,
};

const companyCard: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'center',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  padding: 18,
  background: '#fafafa',
  flexWrap: 'wrap',
};

const companyName: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: 18,
  fontWeight: 800,
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

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const empty: React.CSSProperties = {
  border: '1px dashed #d1d5db',
  borderRadius: 16,
  padding: 18,
  color: '#6b7280',
};