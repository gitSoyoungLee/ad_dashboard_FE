import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
