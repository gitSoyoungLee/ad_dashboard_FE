import client from './client';

// Gemini 응답이 수 초 걸릴 수 있어 기본 timeout(10s)을 60s로 오버라이드한다.
export function requestAiAnalysis() {
  return client.post('/v1/stats/ai-analysis', null, { timeout: 60000 });
}
