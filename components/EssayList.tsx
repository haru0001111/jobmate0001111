import type { Company, EssayEntry } from '@/types';

const categoryLabels: Record<EssayEntry['category'], string> = {
  gakuchika: 'ガクチカ',
  self_pr: '自己PR',
  motivation: '志望動機',
  strengths: '強み・弱み',
  other: 'その他',
};

export default function EssayList({
  items,
  companies,
}: {
  items: EssayEntry[];
  companies?: Company[];
}) {
  const companyMap = new Map((companies ?? []).map((company) => [company.id, company.name]));

  if (items.length === 0) {
    return <p style={{ color: '#6b7280', margin: 0 }}>まだ紐づくESはありません。</p>;
  }

  return (
    <div className="list">
      {items.map((essay) => (
        <div key={essay.id} className="item">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <strong>{essay.question}</strong>
            <span className="badge">{categoryLabels[essay.category]}</span>
          </div>
          {essay.companyId ? (
            <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 8 }}>
              対象企業: {companyMap.get(essay.companyId) ?? '紐づけ済み'}
            </p>
          ) : null}
          <p style={{ color: '#374151', marginTop: 0 }}>{essay.answer200 || essay.answerLong}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {essay.answer400 ? <span className="badge">400字</span> : null}
            {essay.answer300 ? <span className="badge">300字</span> : null}
            {essay.answer200 ? <span className="badge">200字</span> : null}
            {essay.answer100 ? <span className="badge">100字</span> : null}
            {essay.tags.map((tag) => (
              <span key={tag} className="badge">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
