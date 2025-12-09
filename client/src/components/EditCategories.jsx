// client/src/components/EditCategories.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EditCategories({ onBack }) {
  const [categories, setCategories] = useState([]);
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
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    if (token) loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/exercise-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      setNewName("");
      loadCategories();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  return (
    <div>
      <button className="link" onClick={onBack}>
        ← Back
      </button>
      <h2>Edit Categories</h2>

      <ul style={{ marginTop: "1rem" }}>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <form onSubmit={handleAdd} style={{ marginTop: "1rem" }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
        />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
