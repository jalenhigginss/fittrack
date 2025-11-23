// client/src/components/WelcomeScreen.jsx
import React from "react";

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="welcome">
      <h1 className="welcome-title">
        Welcome to <span className="accent">FitTrack</span>
      </h1>

      <ul className="welcome-list">
        <li>
          <span className="welcome-icon">🏋🏽‍♂️</span>
          <div>
            <h3>Track your workouts</h3>
            <p>Log sets, reps, and weight in a clean, simple interface.</p>
          </div>
        </li>
        <li>
          <span className="welcome-icon">⭐</span>
          <div>
            <h3>Stay motivated</h3>
            <p>Watch your history grow and see how consistent you are.</p>
          </div>
        </li>
        <li>
          <span className="welcome-icon">📈</span>
          <div>
            <h3>Analyze your strength</h3>
            <p>View charts and stats of your training over time.</p>
          </div>
        </li>
      </ul>

      <button className="btn-primary welcome-cta" onClick={onGetStarted}>
        Get Started
      </button>

      <p className="welcome-sub">
        Already have an account? <span className="accent">Sign in below</span>
      </p>
    </div>
  );
}
