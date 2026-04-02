import { BrowserRouter, Routes, Route } from 'react-router';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';

function Placeholder({ title }) {
  return <h2 className="text-2xl font-bold text-gray-800">{title}</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ads" element={<Placeholder title="광고 관리" />} />
          <Route path="/reports" element={<Placeholder title="리포트" />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
