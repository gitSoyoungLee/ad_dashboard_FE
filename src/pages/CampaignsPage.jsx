import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { fetchCampaigns } from '../api/campaigns';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return { startDate: toISODate(start), endDate: toISODate(end) };
}

const TYPE_OPTIONS = [
  { value: '', label: '전체 유형' },
  { value: 'TRAFFIC', label: '트래픽' },
  { value: 'CONVERSION', label: '전환' },
  { value: 'DB_AD', label: 'DB 광고' },
];

const SORT_OPTIONS = [
  { value: '', label: '정렬 기준' },
  { value: 'spend', label: '지출액' },
  { value: 'clicks', label: '클릭 수' },
  { value: 'ctr', label: 'CTR' },
  { value: 'resultCount', label: '전환 수' },
  { value: 'actualCpa', label: 'CPA' },
];

function CampaignsPage() {
  const navigate = useNavigate();
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultRange();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [type, setType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(() => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    fetchCampaigns(startDate, endDate, {
      type: type || undefined,
      sortBy: sortBy || undefined,
    })
      .then((res) => {
        const data = res.data.data ?? res.data;
        setCampaigns(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || '데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [startDate, endDate, type, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">캠페인 성과</h2>
          <p className="text-sm text-slate-400 mt-1">캠페인별 성과를 비교하고 분석하세요</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2 shadow-sm">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm text-slate-600 focus:outline-none bg-transparent"
          />
          <span className="text-slate-300">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm text-slate-600 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-slate-400">캠페인 데이터가 없습니다.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">캠페인명</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">유형</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">지출액($)</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">클릭</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">CTR(%)</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">전환</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">CPA($)</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.campaignId}
                  onClick={() => navigate(`/campaigns/${c.campaignId}`, { state: { startDate, endDate, campaignName: c.campaignName } })}
                  className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">{c.campaignName}</td>
                  <td className="px-4 py-4"><StatusBadge type={c.campaignType} /></td>
                  <td className="px-4 py-4 text-right text-slate-600">{c.spend?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{c.clicks?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{c.ctr?.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{c.resultCount?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{c.actualCpa?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CampaignsPage;
