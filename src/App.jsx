import { useState } from "react";
import Ride from "./Ride";
import InfoPage from "./InfoPage";

export default function App() {
  // Replace with your actual logged-in user and leader logic
  const [isLeader, setIsLeader] = useState(false);
  const user = { email: "parent@example.com" }; // Replace with real user info

  const [page, setPage] = useState("ride"); // "ride" or "info"

  // --- Styles ---
  const styles = {
    nav: {
      display: "flex",
      justifyContent: "center",
      margin: "20px 0",
      gap: "10px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
    },
    active: {
      backgroundColor: "#228B22", // green
      color: "#fff",
    },
    inactive: {
      backgroundColor: "#eee", // light grey
      color: "#333",
    },
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      padding: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navigation Tabs */}
      <div style={styles.nav}>
        <button
          style={{ ...styles.button, ...(page === "ride" ? styles.active : styles.inactive) }}
          onClick={() => setPage("ride")}
        >
          Bike Bus Tracker
        </button>
        <button
          style={{ ...styles.button, ...(page === "info" ? styles.active : styles.inactive) }}
          onClick={() => setPage("info")}
        >
          Info
        </button>
      </div>

      {/* Page Content */}
      {page === "ride" ? (
        <Ride user={user} isLeader={isLeader} setIsLeader={setIsLeader} />
      ) : (
        <InfoPage />
      )}
    </div>
  );
}