import type { JobTask } from '@/types';

export default function TaskList({ items }: { items: JobTask[] }) {
  return (
    <div className="list">
      {items.map((item) => (
        <div key={item.id} className="item">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <strong>{item.title}</strong>
            <span className="badge">{item.done ? '完了' : '未完了'}</span>
          </div>
          {item.dueAt ? <p style={{ color: '#6b7280', marginBottom: 0 }}>期限: {new Date(item.dueAt).toLocaleString('ja-JP')}</p> : null}
        </div>
      ))}
    </div>
  );
}
