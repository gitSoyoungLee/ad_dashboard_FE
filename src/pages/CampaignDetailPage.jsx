import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { fetchCampaignAds } from '../api/campaigns';
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

function CampaignDetailPage() {
  const { campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const defaults = getDefaultRange();
  const startDate = location.state?.startDate || defaults.startDate;
  const endDate = location.state?.endDate || defaults.endDate;
  const campaignName = location.state?.campaignName || campaignId;

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchCampaignAds(campaignId, startDate, endDate)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setAds(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || '데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [campaignId, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/campaigns')}
          className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          캠페인 목록으로
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{campaignName}</h2>
        <p className="text-sm text-slate-400 mt-1">
          {startDate} ~ {endDate} 기간의 광고 소재별 성과
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20 text-slate-400">광고 소재 데이터가 없습니다.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">광고 소재명</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">노출</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">CTR(%)</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">지출액($)</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">전환</th>
                <th className="px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">CPA($)</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.adId} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{ad.adName}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{ad.impressions?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{ad.ctr?.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{ad.spend?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{ad.conversions?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{ad.cpa?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CampaignDetailPage;
