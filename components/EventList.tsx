import type { JobEvent } from '@/types';

export default function EventList({ items }: { items: JobEvent[] }) {
  return (
    <div className="list">
      {items.map((item) => (
        <div key={item.id} className="item">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <strong>{item.title}</strong>
            <span className="badge">{item.type}</span>
          </div>
          <p style={{ marginBottom: 4 }}>{new Date(item.startAt).toLocaleString('ja-JP')}</p>
          {item.note ? <p style={{ color: '#6b7280', margin: 0 }}>{item.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
