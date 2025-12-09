// client/src/components/MotivationBanner.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function MotivationBanner() {
  const { authFetch } = useContext(AuthContext);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadQuote = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authFetch("http://localhost:5000/api/motivation");
      if (!res.ok) throw new Error("Failed to load motivation");
      const data = await res.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch (err) {
      console.error(err);
      setError("Could not load motivation right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, []);

  return (
    <div className="motivation-banner">
      {loading && <p>Loading motivation...</p>}
      {error && <p style={{ color: "salmon" }}>{error}</p>}
      {!loading && !error && quote && (
        <>
          <p className="motivation-text">“{quote}”</p>
          <p className="motivation-author">— {author}</p>
        </>
      )}
      <button
        type="button"
        className="btn-secondary"
        onClick={loadQuote}
        style={{ marginTop: "0.5rem" }}
      >
        New quote
      </button>
    </div>
  );
}
