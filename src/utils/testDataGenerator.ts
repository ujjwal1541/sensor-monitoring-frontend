import { api } from '../services/api';

const topics = [
  'sensor/room1/environmental',
  'sensor/room2/environmental',
  'sensor/room3/environmental',
  'sensor/warehouse/environmental',
  'sensor/lab/environmental',
  'sensor/outdoor/environmental',
  'sensor/server-room/environmental',
  'sensor/production-floor/environmental',
];

function getRandomValue(min: number, max: number, shouldViolate = false): number {
  if (shouldViolate) {
    return Math.random() < 0.5 ? min - Math.random() * 10 : max + Math.random() * 10;
  }
  return min + Math.random() * (max - min);
}

export async function generateTestSensorData(count = 1, includeViolations = false) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const shouldViolateTemp = includeViolations && Math.random() < 0.15;
    const shouldViolateHumidity = includeViolations && Math.random() < 0.1;
    const shouldViolateVoltage = includeViolations && Math.random() < 0.08;
    const shouldViolateCurrent = includeViolations && Math.random() < 0.08;
    const shouldViolatePressure = includeViolations && Math.random() < 0.1;

    const sensorData = {
      topic,
      temperature: getRandomValue(-10, 50, shouldViolateTemp),
      humidity: getRandomValue(0, 100, shouldViolateHumidity),
      voltage: getRandomValue(0, 250, shouldViolateVoltage),
      current: getRandomValue(0, 100, shouldViolateCurrent),
      pressure: getRandomValue(900, 1100, shouldViolatePressure),
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await api.ingestSensorData(sensorData);
      results.push(result);
    } catch (error) {
      console.error('Error ingesting sensor data:', error);
    }

    if (count > 1 && i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

export async function startContinuousDataGeneration(intervalMs = 5000) {
  const generate = async () => {
    await generateTestSensorData(1, true);
  };

  await generate();
  return setInterval(generate, intervalMs);
}
