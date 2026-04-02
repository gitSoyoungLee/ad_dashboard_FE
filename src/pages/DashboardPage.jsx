import { useState, useEffect, useCallback } from 'react';
import { fetchSummary, fetchTrends } from '../api/dashboard';
import SummaryCard from '../components/SummaryCard';
import TrendChart from '../components/TrendChart';
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
                  title="총 유입 수"
                  value={summary.totalInbound?.toLocaleString()}
                  unit="회"
                  tooltip="광고를 통해 사이트로 유입된 총 클릭 수 (Meta Clicks 합산)"
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
                  unit="원"
                  tooltip="유저 1명을 획득하는 데 든 비용 (총 지출액 ÷ 회원가입 수)"
                />
                <SummaryCard
                  title="리드 CPA"
                  value={summary.leadCpa?.toLocaleString()}
                  unit="원"
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
        </>
      )}
    </div>
  );
}

export default DashboardPage;
