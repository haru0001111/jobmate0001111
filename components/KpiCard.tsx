export default function KpiCard({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <div className="card">
      <div className="badge">{label}</div>
      <div className="kpi">{value}</div>
      {sublabel ? <p style={{ color: '#6b7280' }}>{sublabel}</p> : null}
    </div>
  );
}
