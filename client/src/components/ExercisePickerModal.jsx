import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExercisePickerModal({ onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      const catRes = await axios.get(
        "http://localhost:5000/api/exercise-categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(catRes.data);
      if (catRes.data.length) {
        const firstId = catRes.data[0].id;
        setCategoryId(firstId.toString());

        const exRes = await axios.get(
          `http://localhost:5000/api/exercises?categoryId=${firstId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExercises(exRes.data);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    const load = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/exercises?categoryId=${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExercises(res.data);
    };
    load();
  }, [categoryId]);

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Select Exercise</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          placeholder="Search exercises"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={{ marginTop: "0.5rem" }}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <ul className="exercise-list">
          {filtered.map((ex) => (
            <li
              key={ex.id}
              onClick={() => {
                onSelect(ex.name);
                onClose();
              }}
            >
              {ex.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
