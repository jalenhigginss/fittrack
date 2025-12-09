import { useContext, useEffect, useState } from "react";
import AddWorkoutForm from "./components/AddWorkoutForm";
import WorkoutList from "./components/WorkoutList";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthContext } from "./AuthContext";
import WorkoutChart from "./components/WorkoutChart";
import BottomNav from "./components/BottomNav";
import RestTimer from "./components/RestTimer";
import StatsSummary from "./components/StatsSummary";
import ProfilePanel from "./components/ProfilePanel";
import WelcomeScreen from "./components/WelcomeScreen";
import RoutinesTab from "./components/RoutinesTab";
import MotivationBanner from "./components/MotivationBanner";

import ExercisePickerModal from "./components/ExercisePickerModal";






function App() {
  const { user, authFetch, logout } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("log"); // "log" | "timer" | "stats" | "profile"
  const [showAuth, setShowAuth] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);


  const fetchWorkouts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await authFetch("/api/workouts");
      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to load workouts.");
        }
        setWorkouts([]);
        return;
      }
      const data = await res.json();
      setWorkouts(data);
      setError("");
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Could not load workouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddWorkout = async (newWorkout) => {
  try {
    const res = await authFetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorkout),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error ${res.status}: ${text}`);
    }

    const created = await res.json();
    setWorkouts((prev) => [created, ...prev]);
  } catch (err) {
    console.error("Error adding workout:", err);
    alert("Error adding workout: " + (err.message || err));
  }
};


return (
  <div className="app">
    <h1>FitTrack: Personal Workout Tracker</h1>

   {user ? (
  <>
    <div className="top-bar">
      <p>
        Signed in as <strong>{user.email}</strong>
      </p>
      <button className="btn-secondary" onClick={logout}>
        Log out
      </button>
    </div>

    <div className="card">
      {activeTab === "log" && (
        <>
        <MotivationBanner />
          <AddWorkoutForm onAdd={handleAddWorkout} />
          <RestTimer />  {/* timer lives on Log tab now */}

          {loading ? (
            <p>Loading workouts...</p>
          ) : error ? (
            <p style={{ color: "salmon" }}>{error}</p>
          ) : (
            <WorkoutList workouts={workouts} />
          )}
        </>
      )}

      {activeTab === "routines" && (
        <RoutinesTab onCreated={fetchWorkouts} />
      )}

      {activeTab === "stats" && (
        <>
          <WorkoutChart workouts={workouts} />
          <StatsSummary workouts={workouts} />
        </>
      )}

      {activeTab === "profile" && (
        <ProfilePanel workouts={workouts} user={user} />
      )}
    </div>

    <BottomNav activeTab={activeTab} onChange={setActiveTab} />
  </>
) : (
  <>
    {/* Welcome screen first */}
    {!showAuth && (
      <div className="card">
        <WelcomeScreen onGetStarted={() => setShowAuth(true)} />
      </div>
    )}

    {/* Auth forms below – always visible, but user is nudged by Get Started */}
    <div className="auth-grid">
      <div className="card">
        <Login />
      </div>
      <div className="card">
        <Register />
      </div>
    </div>
    <p className="hint">
      Use your email and password to sign in or create an account.
    </p>
  </>
)}

  </div>
);

}

export default App;
