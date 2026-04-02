import client from './client';

export function fetchUsers(utmCampaign) {
  return client.get('/v1/users', {
    params: utmCampaign ? { utmCampaign } : {},
  });
}

export function fetchLeads(status, metaCampaignId) {
  return client.get('/v1/leads', {
    params: {
      ...(status && { status }),
      ...(metaCampaignId && { metaCampaignId }),
    },
  });
}

export function syncMeta(startDate, endDate) {
  return client.post('/v1/sync/meta', { startDate, endDate, syncType: '' });
}
