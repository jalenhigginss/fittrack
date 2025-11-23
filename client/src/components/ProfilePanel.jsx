// client/src/components/ProfileTab.jsx
import React, { useState } from "react";
import EditExercises from "./EditExercises";
import EditCategories from "./EditCategories";

export default function ProfileTab({ userEmail }) {
  const [view, setView] = useState("main"); // "main" | "exercises" | "categories"

  if (view === "exercises") return <EditExercises onBack={() => setView("main")} />;
  if (view === "categories") return <EditCategories onBack={() => setView("main")} />;

  return (
    <div>
      <h2>Profile</h2>

      <section className="card">
        <h3>Account</h3>
        <p>{userEmail}</p>
      </section>

      <section className="card">
        <h3>Library</h3>
        <button className="btn-primary" onClick={() => setView("exercises")}>
          Edit exercises
        </button>
        <button className="btn-secondary" onClick={() => setView("categories")}>
          Edit categories
        </button>
      </section>
    </div>
  );
}
