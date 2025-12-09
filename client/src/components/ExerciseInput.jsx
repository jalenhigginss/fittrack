// client/src/components/ExerciseInput.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function ExerciseInput({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [exercises, setExercises] = useState([]);

  const token = localStorage.getItem("token");

  // load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/exercise-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
        if (!categoryId && res.data.length) {
          setCategoryId(res.data[0].id.toString());
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load exercises for selected category
  useEffect(() => {
    if (!categoryId) return;
    const loadExercises = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/exercises?categoryId=${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExercises(res.data);
      } catch (err) {
        console.error("Error loading exercises:", err);
      }
    };
    loadExercises();
  }, [categoryId, token]);

  return (
    <div className="exercise-input">
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

      <label style={{ marginTop: "0.5rem" }}>
        Exercise
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select exercise…</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.name}>
              {ex.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
