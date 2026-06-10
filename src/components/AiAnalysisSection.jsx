import { useState } from 'react';
import { requestAiAnalysis } from '../api/aiAnalysis';

function AiAnalysisSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setLoading(true);
    setError(null);
    requestAiAnalysis()
      .then((res) => {
        const data = res.data.data ?? res.data;
        setResult(data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <div>
            <h3 className="text-base font-bold text-slate-800">AI 성과 분석</h3>
            <p className="text-xs text-slate-400 mt-0.5">최근 7일 광고 성과를 AI가 진단합니다</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              분석 중...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              {result ? '다시 분석' : 'AI 분석'}
            </>
          )}
        </button>
      </div>

      <div className="px-5 py-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500" />
            <p className="text-sm">AI가 광고 성과를 분석하고 있습니다. 수 초 정도 걸릴 수 있어요.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={handleAnalyze}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              다시 시도
            </button>
          </div>
        ) : result ? (
          <AnalysisResult result={result} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-1 text-slate-400">
            <p className="text-sm">아직 분석 결과가 없습니다.</p>
            <p className="text-xs">‘AI 분석’ 버튼을 눌러 최근 7일 성과 진단을 받아보세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  return iso;
}

function AnalysisResult({ result }) {
  const { overallDiagnosis, adDiagnoses, actionItems, startDate, endDate } = result;

  return (
    <div className="space-y-6">
      {(startDate || endDate) && (
        <p className="text-xs text-slate-400">
          분석 기간: {formatDate(startDate)} ~ {formatDate(endDate)}
        </p>
      )}

      {overallDiagnosis && (
        <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-4">
          <h4 className="text-sm font-bold text-slate-700 mb-2">종합 진단</h4>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{overallDiagnosis}</p>
        </div>
      )}

      {adDiagnoses?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700">소재별 진단</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {adDiagnoses.map((ad, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4 flex flex-col gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{ad.adName}</p>
                  {ad.campaignName && (
                    <p className="text-xs text-slate-400 mt-0.5">{ad.campaignName}</p>
                  )}
                </div>
                {ad.diagnosis && (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{ad.diagnosis}</p>
                )}
                {ad.suggestion && (
                  <div className="mt-1 pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-blue-600 mb-1">개선 제안</p>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{ad.suggestion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {actionItems?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-700">액션 아이템</h4>
          <ul className="space-y-2">
            {actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AiAnalysisSection;
