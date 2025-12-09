// client/src/components/MotivationBanner.jsx
import React, { useContext, useEffect, useState } from "react";
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

      //  use relative path – AuthContext will prepend API base
      const res = await authFetch("/motivation");
      if (!res.ok) throw new Error("Failed to load motivation");

      const data = await res.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch (err) {
      console.error("Error loading motivation:", err);
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
      {error ? (
        <p style={{ color: "salmon" }}>{error}</p>
      ) : (
        <>
          <p>{quote || (loading ? "Getting motivation..." : "")}</p>
          {author && <p className="muted">— {author}</p>}
        </>
      )}

      <button
        className="btn-secondary"
        onClick={loadQuote}
        disabled={loading}
        style={{ marginTop: "0.5rem" }}
      >
        {loading ? "Loading..." : "New quote"}
      </button>
    </div>
  );
}
