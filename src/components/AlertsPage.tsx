import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { api, Alert } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [topicFilter, setTopicFilter] = useState('');
  const [parameterFilter, setParameterFilter] = useState('');
  const itemsPerPage = 20;

  useEffect(() => {
    loadAlerts();
  }, [currentPage, topicFilter, parameterFilter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      const result = await api.getAlerts(
        itemsPerPage,
        offset,
        topicFilter || undefined,
        parameterFilter || undefined
      );
      setAlerts(result.data);
      setTotalCount(result.count);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getSeverityColor = (value: number, min: number | null, max: number | null) => {
    if (min !== null && value < min) {
      const diff = Math.abs(value - min) / min;
      return diff > 0.2 ? 'text-red-600' : 'text-orange-600';
    }
    if (max !== null && value > max) {
      const diff = Math.abs(value - max) / max;
      return diff > 0.2 ? 'text-red-600' : 'text-orange-600';
    }
    return 'text-yellow-600';
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadAlerts();
  };

  const handleClearFilters = () => {
    setTopicFilter('');
    setParameterFilter('');
    setCurrentPage(1);
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Alerts History</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">{totalCount} Total Alerts</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              placeholder="Filter by topic"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parameter</label>
            <select
              value={parameterFilter}
              onChange={(e) => setParameterFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Parameters</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="voltage">Voltage</option>
              <option value="current">Current</option>
              <option value="pressure">Pressure</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threshold Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {alert.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium capitalize">
                        {alert.violated_parameter}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      getSeverityColor(alert.actual_value, alert.threshold_min, alert.threshold_max)
                    }`}>
                      {alert.actual_value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {alert.threshold_min !== null && alert.threshold_max !== null
                        ? `${alert.threshold_min} - ${alert.threshold_max}`
                        : alert.threshold_min !== null
                        ? `≥ ${alert.threshold_min}`
                        : alert.threshold_max !== null
                        ? `≤ ${alert.threshold_max}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-5 h-5 ${
                          getSeverityColor(alert.actual_value, alert.threshold_min, alert.threshold_max)
                        }`} />
                        <span className="text-sm font-medium text-gray-700">
                          {alert.threshold_min !== null && alert.actual_value < alert.threshold_min
                            ? 'Below Min'
                            : 'Above Max'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No alerts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{' '}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} alerts
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
