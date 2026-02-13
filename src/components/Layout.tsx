import { Activity, AlertTriangle, Database, LayoutDashboard } from 'lucide-react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'alerts' | 'data';
  onNavigate: (page: 'dashboard' | 'alerts' | 'data') => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alerts' as const, label: 'Alerts', icon: AlertTriangle },
    { id: 'data' as const, label: 'Raw Data', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Sensor Monitoring System</h1>
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
