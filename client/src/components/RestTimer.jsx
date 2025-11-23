// client/src/components/RestTimer.jsx
import React, { useEffect, useState } from "react";

export default function RestTimer() {
  const [seconds, setSeconds] = useState(60); // default 60s
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) return;

    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [running, seconds]);

  const format = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const changeBy = (delta) => {
    setSeconds((s) => Math.max(0, s + delta));
  };

  const reset = () => {
    setSeconds(60);
    setRunning(false);
  };

  return (
    <div className="rest-timer">
      <h2>Rest between sets</h2>
      <div className="rest-timer-circle">
        <span className="rest-timer-time">{format(seconds)}</span>
      </div>

      <div className="rest-timer-controls">
        <button onClick={() => changeBy(-15)} className="circle-btn">
          -15s
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="circle-btn circle-btn-main"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => changeBy(15)} className="circle-btn">
          +15s
        </button>
      </div>

      <button onClick={reset} className="btn-secondary" style={{ marginTop: "0.75rem" }}>
        Reset to 60s
      </button>
    </div>
  );
}
