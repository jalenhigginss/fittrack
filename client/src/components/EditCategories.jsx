// client/src/components/EditCategories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditCategories({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");

  const token = localStorage.getItem("token");

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/exercise-categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await axios.post(
      "http://localhost:5000/api/exercise-categories",
      { name: newName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewName("");
    load();
  };

  return (
    <div>
      <button className="link" onClick={onBack}>
        ← Back
      </button>
      <h2>Edit Categories</h2>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li> // MVP: view only
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
