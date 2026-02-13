# Sensor Monitoring System – Frontend

A modern React + TypeScript dashboard for real-time sensor monitoring, alert tracking, and historical data analysis.

This frontend connects to Supabase Edge Functions to visualize telemetry data collected from IoT devices.

---

## 🚀 Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Supabase (Edge Functions API)

---

## 📊 Features

- 📈 Live Sensor Dashboard
- 🚨 Alerts Monitoring
- 📄 Raw Data Viewer with Pagination
- 📊 Statistics Overview
- Responsive UI
- Type-safe API layer

---

## 🏗️ Project Structure

```
src/
 ├── components/
 │   ├── Dashboard.tsx
 │   ├── AlertsPage.tsx
 │   ├── RawDataPage.tsx
 │   └── Layout.tsx
 │
 ├── services/
 │   └── api.ts
 │
 ├── utils/
 │   └── testDataGenerator.ts
 │
 ├── App.tsx
 └── main.tsx
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/ujjwal1541/sensor-monitoring-frontend/
cd sensor-monitoring-frontend
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-project.functions.supabase.co
```

⚠️ Important:
- Do NOT commit `.env` to GitHub.
- Only use the **anon key** on frontend.
- Never expose the service role key.

---

## 🧪 Running Locally

Start development server:

```bash
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🔌 Backend Dependency

This frontend depends on the backend repository:

```
sensor-monitoring-backend
```

Required Edge Functions:

- ingest-sensor-data
- get-sensor-data
- get-stats
- get-alerts

Make sure backend is deployed before running frontend in production.

---

## 🧠 API Integration

All API calls are centralized in:

```
src/services/api.ts
```

Endpoints used:

- GET /get-stats
- GET /get-sensor-data
- GET /get-alerts

Base URL is configured via:

```ts
import.meta.env.VITE_API_BASE_URL
```

---

## 📱 Pages

### Dashboard
- Displays aggregated statistics
- Shows latest readings
- Quick overview of system status

### Alerts
- Lists threshold violations
- Filterable by parameter
- Timestamped alert history

### Raw Data
- Paginated sensor data
- Topic-based filtering
- Detailed telemetry values

---

## 🛡️ Security Notes

- Uses Supabase anon key for API calls
- Backend handles database access securely
- No sensitive keys stored in frontend

---

## 🧩 Future Improvements

- Add React Router for URL-based navigation
- Add global error boundaries
- Add loading skeletons
- Add retry + timeout handling in API layer
- Add real-time subscriptions

---


MIT License

---
