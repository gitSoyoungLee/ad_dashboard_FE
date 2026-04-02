import client from './client';

export function fetchCampaigns(startDate, endDate, { type, sortBy } = {}) {
  return client.get('/v1/stats/campaigns', {
    params: { startDate, endDate, type, sortBy },
  });
}

export function fetchCampaignAds(campaignId, startDate, endDate) {
  return client.get(`/v1/stats/campaigns/${campaignId}/ads`, {
    params: { startDate, endDate },
  });
}
