import client from './client';

export function fetchSummary(startDate, endDate) {
  return client.get('/v1/stats/summary', {
    params: { startDate, endDate },
  });
}

export function fetchTrends(endDate) {
  return client.get('/v1/stats/trends', {
    params: { endDate },
  });
}
