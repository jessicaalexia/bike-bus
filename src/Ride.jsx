import { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { collection, addDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export default function Ride({ user, isLeader, setIsLeader }) {
  const [children, setChildren] = useState([]);
  const [attending, setAttending] = useState(false);
  const [childName, setChildName] = useState(""); // Input for child’s name
  const [leaderLocation, setLeaderLocation] = useState(null);
  const [currentLeader, setCurrentLeader] = useState(null);

  // Load Google Maps API using .env key
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Fetch children names from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "children"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChildren(data);
    });
    return () => unsubscribe();
  }, []);

  // Fetch current leader from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "leader"), (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setCurrentLeader(docData.name);
      } else {
        setCurrentLeader(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Track leader location
  useEffect(() => {
    if (isLeader && navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLeaderLocation({ lat: latitude, lng: longitude });

          // Update leader info in Firebase
          await setDoc(doc(db, "leader", user.email), {
            name: user.email,
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  }, [isLeader]);

  // Add child name to Firebase
  const handleAttending = async () => {
    if (!attending && childName.trim() !== "") {
      await addDoc(collection(db, "children"), {
        name: childName.trim(),
      });
      setAttending(true);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#228B22", textAlign: "center", marginBottom: "20px" }}>
        🚴 Rapaura School Bike Bus Tracker
      </h1>

      {/* Show leader of the day */}
      {currentLeader && (
        <p style={{ textAlign: "center", color: "#d9534f", fontWeight: "bold", fontSize: "1.1rem" }}>
          Leader of the Day: {currentLeader}
        </p>
      )}

      {/* Leader button */}
      {!isLeader && (
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <button
            onClick={() => setIsLeader(true)}
            style={{
              padding: "12px 20px",
              backgroundColor: "#228B22",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            I am a leader
          </button>
        </div>
      )}
      {isLeader && (
        <p style={{ textAlign: "center", color: "#555", marginBottom: "15px" }}>
          You are now the leader!
        </p>
      )}

      {/* Input for child name and attending button */}
      {!attending && (
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Enter child’s name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            style={{
              padding: "10px",
              width: "200px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginRight: "10px",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={handleAttending}
            style={{
              padding: "10px 18px",
              backgroundColor: "#228B22",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Mark as Attending
          </button>
        </div>
      )}
      {attending && (
        <p style={{ textAlign: "center", color: "#555", marginBottom: "15px" }}>
          {childName} is attending the bike bus today!
        </p>
      )}

      {/* Children list */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#228B22" }}>Attending:</h2>
        <ul>
          {children.map((child) => (
            <li key={child.id}>{child.name}</li>
          ))}
        </ul>
      </div>

      {/* Google Map showing only leader */}
      <div style={{ height: "400px", borderRadius: "8px", overflow: "hidden" }}>
        {isLoaded && leaderLocation ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={leaderLocation}
            zoom={15}
          >
            {isLeader && <Marker position={leaderLocation} label="Leader" />}
          </GoogleMap>
        ) : (
          <p style={{ textAlign: "center", paddingTop: "180px" }}>Loading map...</p>
        )}
      </div>
    </div>
  );
}