import Link from 'next/link';
import EssayList from '@/components/EssayList';
import EventList from '@/components/EventList';
import { companies, events, tasks } from '@/lib/mock-data-v5';
import { mockEssays } from '@/lib/mock-essays';

const stageLabels = {
  interest: '興味あり',
  applied: '応募済み',
  es: 'ES提出',
  test: '適性検査',
  interview: '面接',
  offer: '内定',
  rejected: '不合格',
} as const;

function formatDate(date?: string) {
  if (!date) return '未設定';
  return new Date(date).toLocaleString('ja-JP');
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = companies.find((item) => item.id === id);

  if (!company) {
    return (
      <main className="container">
        <div className="card">
          <h1>企業が見つかりません</h1>
          <Link href="/dashboard" className="btn btn-secondary">ダッシュボードへ戻る</Link>
        </div>
      </main>
    );
  }

  const companyEvents = events.filter((item) => item.companyId === company.id).sort((a, b) => a.startAt.localeCompare(b.startAt));
  const companyTasks = tasks.filter((item) => item.companyId === company.id);
  const relatedEssays = mockEssays.filter((item) => item.companyId === company.id || item.tags.some((tag) => [company.name, company.industry, company.testType].filter(Boolean).includes(tag)));

  return (
    <main className="container">
      <div className="header">
        <div>
          <Link href="/dashboard" className="badge" style={{ marginBottom: 12 }}>← ダッシュボード</Link>
          <h1 style={{ margin: 0 }}>{company.name}</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>{company.description || '企業メモをここに表示'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span className="badge">{stageLabels[company.stage]}</span>
          {company.industry ? <span className="badge">{company.industry}</span> : null}
          {company.testType ? <span className="badge">{company.testType}</span> : null}
        </div>
      </div>

      <section className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card">
          <span className="badge">募集要項</span>
          <h2>応募条件</h2>
          <p><strong>職種:</strong> {company.jobType || '未設定'}</p>
          <p><strong>勤務地:</strong> {company.location || '未設定'}</p>
          <p><strong>給与:</strong> {company.salary || '未設定'}</p>
          <p style={{ marginBottom: 0 }}><strong>締切:</strong> {formatDate(company.deadline)}</p>
        </div>
        <div className="card">
          <span className="badge">選考フロー</span>
          <h2>今どこまで進んでるか</h2>
          <div className="list">
            {(company.selectionFlow || []).map((step, index) => (
              <div key={step} className="item" style={{ padding: 12 }}>
                <strong>{index + 1}. {step}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <span className="badge">進捗メモ</span>
          <h2>Company Hub</h2>
          <p><strong>適性検査:</strong> {company.testType || '未設定'}</p>
          <p><strong>Webサイト:</strong> {company.website ? <a href={company.website} target="_blank">募集ページ</a> : '未設定'}</p>
          <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}><strong>メモ:</strong> {company.memo || '未設定'}</p>
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
        <div className="card">
          <div className="header">
            <h2>マイページ / 採用ページ</h2>
            <span className="badge">v5追加</span>
          </div>
          <p><strong>マイページURL:</strong> {company.portal?.portalUrl ? <a href={company.portal.portalUrl} target="_blank">マイページを開く</a> : '未設定'}</p>
          <p><strong>採用ページURL:</strong> {company.portal?.recruitingUrl ? <a href={company.portal.recruitingUrl} target="_blank">採用ページを開く</a> : '未設定'}</p>
          <p><strong>ログインID:</strong> {company.portal?.loginId || '未設定'}</p>
          <p><strong>ID種別:</strong> {company.portal?.loginIdLabel || '未設定'}</p>
          <p><strong>ログインメモ:</strong> {company.portal?.loginMemo || '未設定'}</p>
          <p><strong>最終確認:</strong> {formatDate(company.portal?.lastCheckedAt)}</p>
          <p style={{ marginBottom: 0 }}><strong>次回確認予定:</strong> {formatDate(company.portal?.nextCheckAt)}</p>
        </div>

        <div className="card">
          <div className="header">
            <h2>認証情報ポリシー</h2>
            <span className="badge">安全設計</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            <li>ID は企業ごとに保存して再利用できる</li>
            <li>パスワードは MVP では保存しない</li>
            <li>必要なら後でクライアント暗号化を追加する</li>
            <li>自動ログインや自動送信は行わない</li>
          </ul>
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start' }}>
        <div className="grid">
          <div className="card">
            <div className="header">
              <h2>関連するES回答</h2>
              <span className="badge">再利用候補</span>
            </div>
            <EssayList items={relatedEssays} />
          </div>

          <div className="card">
            <div className="header">
              <h2>今後の予定</h2>
              <span className="badge">面接・締切</span>
            </div>
            <EventList items={companyEvents} />
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <div className="header">
              <h2>対応タスク</h2>
              <span className="badge">直近優先</span>
            </div>
            <div className="list">
              {companyTasks.length === 0 ? (
                <p style={{ color: '#6b7280', margin: 0 }}>まだタスクはありません。</p>
              ) : (
                companyTasks.map((task) => (
                  <div key={task.id} className="item">
                    <strong>{task.title}</strong>
                    <p style={{ color: '#6b7280', marginBottom: 0 }}>
                      期限: {formatDate(task.dueAt)} / {task.done ? '完了' : '未完了'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="header">
              <h2>次のアクション</h2>
              <span className="badge">実装順</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Company Hub に編集フォームを追加</li>
              <li>Firestore に portal 情報を保存する</li>
              <li>Chrome拡張で URL と loginId を紐づけ表示する</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
