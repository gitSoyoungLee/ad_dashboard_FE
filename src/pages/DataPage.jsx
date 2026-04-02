import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, fetchLeads } from '../api/sync';
import Spinner from '../components/Spinner';

const TABS = [
  { key: 'users', label: '가입자 (Users)' },
  { key: 'leads', label: '리드 (Leads)' },
];

const LEAD_STATUS_OPTIONS = [
  { value: '', label: '전체 상태' },
  { value: 'NEW', label: 'NEW' },
  { value: 'VERIFIED', label: 'VERIFIED' },
  { value: 'REJECTED', label: 'REJECTED' },
];

function DataPage() {
  const [tab, setTab] = useState('users');

  // users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // leads state
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadStatus, setLeadStatus] = useState('');

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    fetchUsers()
      .then((res) => {
        const body = res.data.data ?? res.data;
        setUsers(body.users ?? []);
      })
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, []);

  const loadLeads = useCallback(() => {
    setLeadsLoading(true);
    fetchLeads(leadStatus)
      .then((res) => {
        const body = res.data.data ?? res.data;
        setLeads(body.leads ?? []);
      })
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false));
  }, [leadStatus]);

  useEffect(() => {
    if (tab === 'users') loadUsers();
    else loadLeads();
  }, [tab, loadUsers, loadLeads]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">데이터 관리</h2>
        <p className="text-sm text-slate-400 mt-1">로우 데이터를 조회합니다</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Lead filter */}
          {tab === 'leads' && (
            <div className="mb-4">
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LEAD_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Users Table */}
          {tab === 'users' && (
            usersLoading ? <Spinner /> : users.length === 0 ? (
              <EmptyState message="가입자 데이터가 없습니다." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">이름</th>
                      <th className="px-4 py-3">이메일</th>
                      <th className="px-4 py-3">UTM Source</th>
                      <th className="px-4 py-3">UTM Campaign</th>
                      <th className="px-4 py-3">가입일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-500">{u.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                        <td className="px-4 py-3 text-slate-500">{u.utmSource}</td>
                        <td className="px-4 py-3 text-slate-500">{u.utmCampaign}</td>
                        <td className="px-4 py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Leads Table */}
          {tab === 'leads' && (
            leadsLoading ? <Spinner /> : leads.length === 0 ? (
              <EmptyState message="리드 데이터가 없습니다." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">고객명</th>
                      <th className="px-4 py-3">이메일</th>
                      <th className="px-4 py-3">상태</th>
                      <th className="px-4 py-3">유효 여부</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leads.map((l) => (
                      <tr key={l.leadId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-500">{l.leadId}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{l.customerName}</td>
                        <td className="px-4 py-3 text-slate-600">{l.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            l.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-600'
                              : l.status === 'REJECTED'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {l.isQualified ? (
                            <span className="text-emerald-500">Y</span>
                          ) : (
                            <span className="text-slate-400">N</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-16">
      <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <p className="mt-3 text-sm text-slate-400">{message}</p>
    </div>
  );
}

export default DataPage;
