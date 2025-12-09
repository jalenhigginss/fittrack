// client/src/components/EditExercises.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EditExercises({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [newName, setNewName] = useState("");

  const token = localStorage.getItem("token");

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/exercise-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
      if (!categoryId && data.length) setCategoryId(data[0].id.toString());
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadExercises = async (catId) => {
    if (!catId) return;
    try {
      const res = await fetch(`${API_BASE}/exercises?categoryId=${catId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load exercises");
      const data = await res.json();
      setExercises(data);
    } catch (err) {
      console.error("Error loading exercises:", err);
    }
  };

  useEffect(() => {
    if (token) loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (categoryId && token) loadExercises(categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !categoryId) return;

    try {
      const res = await fetch(`${API_BASE}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          categoryId: Number(categoryId),
        }),
      });
      if (!res.ok) throw new Error("Failed to add exercise");
      setNewName("");
      loadExercises(categoryId);
    } catch (err) {
      console.error("Error adding exercise:", err);
    }
  };

  return (
    <div>
      <button className="link" onClick={onBack}>
        ← Back
      </button>
      <h2>Edit Exercises</h2>

      <label>
        Category:
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

      <ul style={{ marginTop: "1rem" }}>
        {exercises.length === 0 ? (
          <li style={{ color: "#9ca3af" }}>
            No exercises in this category yet.
          </li>
        ) : (
          exercises.map((ex) => <li key={ex.id}>{ex.name}</li>)
        )}
      </ul>

      <form onSubmit={handleAdd} style={{ marginTop: "1rem" }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New exercise name"
        />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
