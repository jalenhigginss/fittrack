// client/src/components/RoutinesTab.jsx
import React, { useState } from "react";
import axios from "axios";

const routines = [
  {
    id: "full-body",
    name: "Full Body",
    exercises: [
      { exercise: "Squat", sets: 3, reps: 8, weight: 135 },
      { exercise: "Bench Press", sets: 3, reps: 8, weight: 135 },
      { exercise: "Barbell Row", sets: 3, reps: 8, weight: 95 },
    ],
  },
  {
    id: "push",
    name: "Push",
    exercises: [
      { exercise: "Bench Press", sets: 4, reps: 8, weight: 135 },
      { exercise: "Shoulder Press", sets: 3, reps: 10, weight: 65 },
      { exercise: "Tricep Pushdown", sets: 3, reps: 12, weight: 40 },
    ],
  },
  {
    id: "pull",
    name: "Pull",
    exercises: [
      { exercise: "Pull-ups", sets: 3, reps: 8, weight: null },
      { exercise: "Lat Pulldown", sets: 3, reps: 10, weight: 120 },
      { exercise: "Barbell Curl", sets: 3, reps: 10, weight: 50 },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    exercises: [
      { exercise: "Back Squat", sets: 4, reps: 6, weight: 185 },
      { exercise: "Romanian Deadlift", sets: 3, reps: 8, weight: 135 },
      { exercise: "Leg Press", sets: 3, reps: 12, weight: 200 },
    ],
  },
];

export default function RoutinesTab({ onCreated }) {
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogRoutine = async (routine) => {
    setMessage("");
    setLoadingId(routine.id);

    try {
      const token = localStorage.getItem("token");

      // ✅ Use LOCAL date, not UTC, so it doesn't shift a day
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD

      // Create one workout entry per exercise
      await Promise.all(
        routine.exercises.map((ex) =>
          axios.post(
            "http://localhost:5000/api/workouts",
            {
              workoutName: routine.name,
              exercise: ex.exercise,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              date: dateStr,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setMessage(`Logged ${routine.name} for today.`);
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      setMessage("Error logging routine.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h2>Routines</h2>
      <p style={{ marginBottom: "1rem", color: "#9ca3af" }}>
        Choose a preset workout. FitTrack will log each exercise for today.
      </p>

      {routines.map((routine) => (
        <div key={routine.id} className="routine-card">
          <div className="routine-header">
            <h3>{routine.name}</h3>
            <button
              className="btn-primary"
              style={{ paddingInline: "0.9rem" }}
              onClick={() => handleLogRoutine(routine)}
              disabled={loadingId === routine.id}
            >
              {loadingId === routine.id ? "Logging..." : "Log this routine"}
            </button>
          </div>
          <ul className="routine-exercise-list">
            {routine.exercises.map((ex, idx) => (
              <li key={idx}>
                <strong>{ex.exercise}</strong> — {ex.sets} × {ex.reps}
                {ex.weight != null && ` @ ${ex.weight} lbs`}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {message && <p style={{ marginTop: "0.75rem" }}>{message}</p>}
    </div>
  );
}
