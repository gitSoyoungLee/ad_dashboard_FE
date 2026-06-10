import { useState, useEffect, useCallback } from 'react';
import { fetchSummary, fetchTrends } from '../api/dashboard';
import { syncMeta } from '../api/sync';
import SummaryCard from '../components/SummaryCard';
import TrendChart from '../components/TrendChart';
import Spinner from '../components/Spinner';
import AiAnalysisSection from '../components/AiAnalysisSection';

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return { startDate: toISODate(start), endDate: toISODate(end) };
}

function formatDateTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('ko-KR');
}

function DashboardPage() {
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultRange();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  const loadData = useCallback(() => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    const summaryReq = fetchSummary(startDate, endDate)
      .then((res) => res.data.data ?? res.data)
      .then((data) => setSummary(data));

    const trendsReq = fetchTrends(endDate)
      .then((res) => {
        const body = res.data.data ?? res.data;
        const rows = body.labels.map((label, i) => ({
          date: label,
          spend: body.spendData[i] ?? 0,
          impressions: body.impressionsData[i] ?? 0,
          clicks: body.clicksData[i] ?? 0,
          totalInbound: body.totalInboundData[i] ?? 0,
        }));
        setTrends(rows);
      });

    Promise.all([summaryReq, trendsReq])
      .catch((err) => setError(err.message || '데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = () => {
    setSyncing(true);
    setSyncMsg(null);
    syncMeta(startDate, endDate)
      .then((res) => {
        const body = res.data.data ?? res.data;
        setSyncMsg({ type: 'success', text: body.message });
        loadData();
      })
      .catch((err) => {
        setSyncMsg({ type: 'error', text: err.response?.data?.message || '동기화에 실패했습니다.' });
      })
      .finally(() => setSyncing(false));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">대시보드</h2>
          <p className="text-sm text-slate-400 mt-1">광고 성과를 한눈에 확인하세요</p>
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

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : (
        <>
          {/* Sync Section */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {syncing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  동기화 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
                  </svg>
                  Meta 동기화
                </>
              )}
            </button>
            {syncMsg && (
              <span className={`text-sm ${syncMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                {syncMsg.text}
              </span>
            )}
          </div>

          {summary && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <SummaryCard
                  title="총 지출액"
                  value={summary.totalSpend?.toLocaleString()}
                  unit="$"
                  tooltip="Meta 광고 플랫폼에서 집행된 총 광고비 합산 금액"
                />
                <SummaryCard
                  title="전환 수"
                  value={summary.totalInbound?.toLocaleString()}
                  unit="회"
                  tooltip="기간 내 신규 전환된 고객 수 (회원가입 수 + 유효 리드 수)"
                />
                <SummaryCard
                  title="회원가입 수"
                  value={summary.userCount?.toLocaleString()}
                  unit="명"
                  tooltip="내부 DB 기준 실제 회원가입을 완료한 사용자 수"
                />
                <SummaryCard
                  title="유효 리드 수"
                  value={summary.validLeadCount?.toLocaleString()}
                  unit="건"
                  tooltip="유효 상태로 확인된 리드 수 (내부 DB leads 테이블 기준)"
                />
                <SummaryCard
                  title="통합 CAC"
                  value={summary.totalCac?.toLocaleString()}
                  unit="$"
                  tooltip="유저 1명을 획득하는 데 든 비용 (총 지출액 ÷ 회원가입 수)"
                />
                <SummaryCard
                  title="리드 CPA"
                  value={summary.leadCpa?.toLocaleString()}
                  unit="$"
                  tooltip="유효 리드 1건을 획득하는 데 든 비용 (총 지출액 ÷ 유효 리드 수)"
                />
              </div>
              {summary.syncedAt && (
                <p className="text-xs text-slate-400 text-right">
                  최종 동기화: {formatDateTime(summary.syncedAt)}
                </p>
              )}
            </>
          )}

          {trends && <TrendChart data={trends} />}

          <AiAnalysisSection />
        </>
      )}
    </div>
  );
}

export default DashboardPage;
