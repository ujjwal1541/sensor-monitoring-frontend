const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface SensorData {
  id: string;
  topic: string;
  temperature: number;
  humidity: number;
  voltage: number;
  current: number;
  pressure: number;
  timestamp: string;
  created_at: string;
}

export interface Alert {
  id: string;
  topic: string;
  violated_parameter: string;
  actual_value: number;
  threshold_min: number | null;
  threshold_max: number | null;
  timestamp: string;
  created_at: string;
}

export interface Stats {
  totalMessages: number;
  totalAlerts: number;
  latestReadings: SensorData | null;
  recentAlerts: Alert[];
  activeTopics: number;
  topics: string[];
}

export const api = {
  async getStats(): Promise<Stats> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-stats`, { headers });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getSensorData(limit = 100, offset = 0, topic?: string): Promise<{ data: SensorData[], count: number }> {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (topic) params.append('topic', topic);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-sensor-data?${params}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch sensor data');
    return response.json();
  },

  async getAlerts(limit = 100, offset = 0, topic?: string, parameter?: string): Promise<{ data: Alert[], count: number }> {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (topic) params.append('topic', topic);
    if (parameter) params.append('parameter', parameter);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-alerts?${params}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async ingestSensorData(data: Omit<SensorData, 'id' | 'created_at'>): Promise<any> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ingest-sensor-data`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to ingest sensor data');
    return response.json();
  },
};
