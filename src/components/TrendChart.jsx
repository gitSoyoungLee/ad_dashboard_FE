import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function TrendChart({ data }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-700 mb-6">최근 30일 추이</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: '지출($)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#94a3b8' } }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: '노출/클릭/전환', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#94a3b8' } }} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '12px 16px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
          <Bar yAxisId="left" dataKey="spend" name="지출액" fill="url(#spendGrad)" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" dataKey="impressions" name="노출" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
          <Line yAxisId="right" dataKey="clicks" name="클릭" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
          <Line yAxisId="right" dataKey="totalInbound" name="총 전환" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
