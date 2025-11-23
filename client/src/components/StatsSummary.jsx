// client/src/components/StatsSummary.jsx
import React, { useMemo } from "react";

export default function StatsSummary({ workouts }) {
  const stats = useMemo(() => {
    if (!workouts?.length) return null;

    const total = workouts.length;
    const byExercise = new Map();

    workouts.forEach((w) => {
      const name = w.exercise || "Unknown";
      const current = byExercise.get(name) || { maxWeight: 0, count: 0 };
      current.count += 1;
      if (w.weight && w.weight > current.maxWeight) {
        current.maxWeight = w.weight;
      }
      byExercise.set(name, current);
    });

    const topExercises = Array.from(byExercise.entries())
      .map(([exercise, { maxWeight, count }]) => ({ exercise, maxWeight, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { total, topExercises };
  }, [workouts]);

  if (!stats) return <p>No workout data yet for stats.</p>;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Summary</h3>
      <p>Total workouts logged: <strong>{stats.total}</strong></p>
      <h4>Top Exercises</h4>
      <ul>
        {stats.topExercises.map((ex) => (
          <li key={ex.exercise}>
            <strong>{ex.exercise}</strong> — {ex.count} logs, best {ex.maxWeight || 0} lbs
          </li>
        ))}
      </ul>
    </div>
  );
}
