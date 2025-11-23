// client/src/components/BottomNav.jsx
import React from "react";

export default function BottomNav({ activeTab, onChange }) {
  const tabs = [
    { id: "log", label: "Log" },
    { id: "routines", label: "Routines" },
    { id: "stats", label: "Statistics" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={
            "bottom-nav-item" +
            (activeTab === tab.id ? " bottom-nav-item--active" : "")
          }
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
