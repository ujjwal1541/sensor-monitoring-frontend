import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Database, Thermometer, Droplets, Zap, Gauge, Play, Square } from 'lucide-react';
import { api, Stats } from '../services/api';
import { generateTestSensorData, startContinuousDataGeneration } from '../utils/testDataGenerator';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingData, setGeneratingData] = useState(false);
  const [autoGenerateInterval, setAutoGenerateInterval] = useState<number | null>(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => {
      clearInterval(interval);
      if (autoGenerateInterval) {
        clearInterval(autoGenerateInterval);
      }
    };
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestData = async () => {
    setGeneratingData(true);
    try {
      await generateTestSensorData(10, true);
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate test data');
    } finally {
      setGeneratingData(false);
    }
  };

  const handleToggleAutoGenerate = async () => {
    if (autoGenerateInterval) {
      clearInterval(autoGenerateInterval);
      setAutoGenerateInterval(null);
    } else {
      const interval = await startContinuousDataGeneration(5000);
      setAutoGenerateInterval(interval as unknown as number);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const getSensorIcon = (param: string) => {
    switch (param) {
      case 'temperature': return Thermometer;
      case 'humidity': return Droplets;
      case 'voltage': case 'current': return Zap;
      case 'pressure': return Gauge;
      default: return Activity;
    }
  };

  const formatValue = (param: string, value: number) => {
    const units: Record<string, string> = {
      temperature: '°C',
      humidity: '%',
      voltage: 'V',
      current: 'A',
      pressure: 'hPa',
    };
    return `${value.toFixed(2)} ${units[param] || ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateTestData}
            disabled={generatingData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Database className="w-5 h-5" />
            <span>{generatingData ? 'Generating...' : 'Generate Test Data'}</span>
          </button>
          <button
            onClick={handleToggleAutoGenerate}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
              autoGenerateInterval
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {autoGenerateInterval ? (
              <>
                <Square className="w-5 h-5" />
                <span>Stop Auto-Generate</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Auto-Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalMessages || 0}</p>
            </div>
            <Database className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats?.totalAlerts || 0}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Topics</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeTopics || 0}</p>
            </div>
            <Activity className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Alerts</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.recentAlerts.length || 0}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Sensor Readings</h2>
          {stats?.latestReadings ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Topic:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.latestReadings.topic}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['temperature', 'humidity', 'voltage', 'current', 'pressure'].map((param) => {
                  const Icon = getSensorIcon(param);
                  const value = stats.latestReadings![param as keyof typeof stats.latestReadings] as number;
                  return (
                    <div key={param} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600 capitalize">{param}</p>
                        <p className="text-sm font-semibold text-gray-900">{formatValue(param, value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(stats.latestReadings.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No sensor data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {stats?.recentAlerts && stats.recentAlerts.length > 0 ? (
              stats.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {alert.violated_parameter} Violation
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Topic: {alert.topic} | Value: {alert.actual_value.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent alerts</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Topics</h2>
        <div className="flex flex-wrap gap-2">
          {stats?.topics && stats.topics.length > 0 ? (
            stats.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {topic}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No active topics</p>
          )}
        </div>
      </div>
    </div>
  );
}
