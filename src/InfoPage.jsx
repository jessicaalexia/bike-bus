import { useState } from "react";

export default function InfoPage() {
  const [openSection, setOpenSection] = useState(null);

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      backgroundColor: "#fff", // white background
      color: "#333", // dark text
      borderRadius: "8px",
    },
    title: {
      color: "#228B22", // green title
      fontSize: "2rem",
      marginBottom: "20px",
      textAlign: "center",
    },
    sectionHeader: {
      backgroundColor: "#f0f8f0", // light green
      color: "#228B22", // green text
      padding: "12px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "10px",
      border: "1px solid #228B22",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "1.1rem",
    },
    sectionContent: {
      padding: "10px 16px",
      backgroundColor: "#fff",
      borderRadius: "6px",
      border: "1px solid #ddd",
      marginTop: "5px",
      lineHeight: "1.6",
      color: "#333", // ensure text is visible
    },
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About the Bike Bus Tracker</h1>

      {/* Section 1: Overview */}
      <div>
        <div
          style={styles.sectionHeader}
          onClick={() => toggleSection("overview")}
        >
          🚴 Overview
        </div>
        {openSection === "overview" && (
          <div style={styles.sectionContent}>
            Welcome to the Rapaura School Bike Bus Tracker! This app allows parents to mark their children as joining the bike bus,
          and track the leader in real time. The leader’s location is updated automatically as they ride, ensuring all parents
          know where the bike bus is at any time. The list resets automatically each day so every morning starts fresh! This is a 
          parent lead initiative to promote the need of a bike path for our Rural School. We will have hi vis vests for students to 
          wear, lights on bikes at minimum two parents biking at front and back of the pack with a car following behind with hazard 
          lights on and a sign. We will be pulling over for traffic. We will need the children to know their road rules and be able 
          to listen and respond to any instructions given by the parents.
          We will be departing from 240 Old Renwick Road at 8am and from school at 3pm (to let school traffic go first) back to starting point.
          </div>
        )}
      </div>

      {/* Section 2: How to Use */}
      <div>
        <div
          style={styles.sectionHeader}
          onClick={() => toggleSection("howto")}
        >
          ✅ How to Use
        </div>
        {openSection === "howto" && (
          <div style={styles.sectionContent}>
            <ul>
              <li>Enter your child’s name and click “Mark as Joining”.</li>
              <li>The leader’s location is visible on the map in real time.</li>
              <li>The list updates automatically as new children join.</li>
              <li>Each day starts with a fresh list, managed automatically.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Section 3: Contact / Help */}
      <div>
        <div
          style={styles.sectionHeader}
          onClick={() => toggleSection("contact")}
        >
          📞 Contact / Help
        </div>
        {openSection === "contact" && (
          <div style={styles.sectionContent}>
            For any questions about the bike bus, please contact the school office.
            You can also send feedback through the app to improve functionality.
          </div>
        )}
      </div>
    </div>
  );
}