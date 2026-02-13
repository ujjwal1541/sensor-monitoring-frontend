import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlertsPage from './components/AlertsPage';
import RawDataPage from './components/RawDataPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'alerts' | 'data'>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'alerts':
        return <AlertsPage />;
      case 'data':
        return <RawDataPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
