import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExerciseInput({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [exercises, setExercises] = useState([]);

  const token = localStorage.getItem("token");

  // load categories once
  useEffect(() => {
    const loadCategories = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/exercise-categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data);
      if (!categoryId && res.data.length) {
        setCategoryId(res.data[0].id.toString());
      }
    };
    loadCategories();
  }, []);

  // load exercises for selected category
  useEffect(() => {
    if (!categoryId) return;
    const loadExercises = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/exercises?categoryId=${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExercises(res.data);
    };
    loadExercises();
  }, [categoryId]);

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
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
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
