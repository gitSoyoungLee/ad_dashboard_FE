const styles = {
  TRAFFIC: 'bg-blue-50 text-blue-600',
  CONVERSION: 'bg-emerald-50 text-emerald-600',
  DB_AD: 'bg-violet-50 text-violet-600',
};

const labels = {
  TRAFFIC: '트래픽',
  CONVERSION: '전환',
  DB_AD: 'DB 광고',
};

function StatusBadge({ type }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-slate-100 text-slate-600'}`}>
      {labels[type] || type}
    </span>
  );
}

export default StatusBadge;
