import Link from 'next/link';
import type { Company } from '@/types';

const stageLabels: Record<Company['stage'], string> = {
  interest: '興味あり',
  applied: '応募済み',
  es: 'ES提出',
  test: '適性検査',
  interview: '面接',
  offer: '内定',
  rejected: '不合格',
};

export default function CompanyList({ items }: { items: Company[] }) {
  return (
    <div className="list">
      {items.map((item) => (
        <Link key={item.id} href={`/companies/${item.id}`} className="item" style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <strong>{item.name}</strong>
            <span className="badge">{stageLabels[item.stage]}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {item.industry ? <span className="badge">{item.industry}</span> : null}
            {item.testType ? <span className="badge">{item.testType}</span> : null}
          </div>
          {item.memo ? <p style={{ color: '#6b7280', margin: 0 }}>{item.memo}</p> : null}
        </Link>
      ))}
    </div>
  );
}
