import { BrowserRouter, Routes, Route } from 'react-router';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import DataPage from './pages/DataPage';

function Placeholder({ title }) {
  return <h2 className="text-2xl font-bold text-slate-800">{title}</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:campaignId" element={<CampaignDetailPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/reports" element={<Placeholder title="리포트" />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
