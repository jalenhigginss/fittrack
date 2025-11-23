// client/src/components/WorkoutChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Simple chart: workouts per day
function transformWorkouts(workouts) {
  const countsByDate = new Map();

  workouts.forEach((w) => {
    if (!w.date) return;
    const d = new Date(w.date);
    // normalize to YYYY-MM-DD
    const dateStr = d.toISOString().slice(0, 10);
    countsByDate.set(dateStr, (countsByDate.get(dateStr) || 0) + 1);
  });

  // turn map into sorted array
  const data = Array.from(countsByDate.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return data;
}

export default function WorkoutChart({ workouts }) {
  const data = transformWorkouts(workouts);

  if (!data.length) {
    return <p>No data yet for chart. Log a workout to see trends.</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Workout Frequency Over Time</h2>
      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        Each point shows how many workouts you logged on that day.
      </p>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
