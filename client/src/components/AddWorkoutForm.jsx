// client/src/components/AddWorkoutForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function getTodayLocalDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AddWorkoutForm({ onAdd }) {
  const [workoutName, setWorkoutName] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [dateStr, setDateStr] = useState("");

  const token = localStorage.getItem("token");

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/exercise-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
        if (res.data.length) {
          const firstId = res.data[0].id.toString();
          setCategoryId(firstId);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    if (token) loadCategories();
  }, [token]);

  // Load exercises whenever category changes
  useEffect(() => {
    const loadExercises = async () => {
      if (!categoryId) {
        setExercises([]);
        setExerciseName("");
        return;
      }
      try {
        const res = await axios.get(
          `${API_BASE}/exercises?categoryId=${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExercises(res.data);
        if (res.data.length) {
          setExerciseName(res.data[0].name);
        } else {
          setExerciseName("");
        }
      } catch (err) {
        console.error("Error loading exercises", err);
        setExercises([]);
        setExerciseName("");
      }
    };
    if (token) loadExercises();
  }, [categoryId, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exerciseName) {
      alert("Please select an exercise or add one first.");
      return;
    }

    const payload = {
      workoutName: workoutName || null,
      exercise: exerciseName,
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      weight: weight ? Number(weight) : null,
      date: dateStr || getTodayLocalDate(),
    };

    onAdd(payload);

    setWorkoutName("");
    setSets("");
    setReps("");
    setWeight("");
    // keep category & exercise selected
  };

  return (
    <form className="workout-form" onSubmit={handleSubmit}>
      <h2>Log a Workout</h2>

      <div className="form-row">
        <label>
          Workout name (optional)
          <input
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g. Push Day, Midday"
          />
        </label>

        <label>
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Exercise
          <select
            value={exerciseName || ""}
            onChange={(e) => setExerciseName(e.target.value)}
          >
            {exercises.length === 0 ? (
              <option value="">No exercises in this category</option>
            ) : (
              <>
                <option value="">Select exercise…</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.name}>
                    {ex.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </label>

        <label>
          Sets
          <input
            type="number"
            min="1"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </label>

        <label>
          Reps
          <input
            type="number"
            min="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </label>

        <label>
          Weight (lbs)
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="btn-primary full-width">
        Add Workout
      </button>
    </form>
  );
}


