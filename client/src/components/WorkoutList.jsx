// client/src/components/WorkoutList.jsx
import React from "react";

// group workouts by YYYY-MM-DD (no timezone games)
function groupByDate(workouts) {
  const groups = new Map();

  workouts.forEach((w) => {
    if (!w.date) return;

    // w.date is like "2025-11-20T00:00:00.000Z" or "2025-11-20"
    const raw = typeof w.date === "string" ? w.date : String(w.date);
    const dateStr = raw.slice(0, 10); // "YYYY-MM-DD"

    if (!groups.has(dateStr)) groups.set(dateStr, []);
    groups.get(dateStr).push(w);
  });

  const sorted = Array.from(groups.entries()).sort((a, b) =>
    a[0] < b[0] ? 1 : -1
  );

  return sorted.map(([dateKey, items]) => ({ dateKey, items }));
}

// build a Date using year, month, day (local time, so no UTC shift)
function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const d = new Date(year, month - 1, day); // local date, no offset issues

  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkoutList({ workouts }) {
  if (!workouts || workouts.length === 0) {
    return <p>No workouts logged yet.</p>;
  }

  const grouped = groupByDate(workouts);

  return (
    <div>
      <h2>Workout History</h2>
      {grouped.map(({ dateKey, items }) => {
        const label = formatDateLabel(dateKey);
        const count = items.length;

        return (
          <div key={dateKey} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontWeight: 600,
                marginBottom: "0.25rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.95rem",
              }}
            >
              <span>{label}</span>
              <span>
                {count} workout{count !== 1 ? "s" : ""}
              </span>
            </div>
            <ul style={{ margin: 0 }}>
              {items.map((w) => {
                const mainTitle = w.workout_name || w.exercise;
                const secondary =
                  w.workout_name && w.exercise ? ` – ${w.exercise}` : "";

                const setsPart = w.sets ? `${w.sets} sets` : "";
                const repsPart = w.reps ? `${w.reps} reps` : "";
                const weightPart = w.weight ? `@ ${w.weight} lbs` : "";

                let detail = "";
                if (setsPart || repsPart) {
                  detail = `${setsPart}${
                    setsPart && repsPart ? " × " : ""
                  }${repsPart}`;
                }

                return (
                  <li key={w.id}>
                    <strong>{mainTitle}</strong>
                    {secondary}
                    {(detail || weightPart) && " — "}
                    {detail}
                    {detail && weightPart ? " " : ""}
                    {weightPart}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
