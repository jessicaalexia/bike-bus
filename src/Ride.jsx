import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, writeBatch, getDocs } from "firebase/firestore";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { db } from "./firebase"; // your firebase config

import "react-toastify/dist/ReactToastify.css";

const Ride = () => {
  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState("");
  const [leader, setLeader] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // Load Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Attendance listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "attending"), (snapshot) => {
      setChildren(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });
    return () => unsub();
  }, []);

  // User location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // Add child
  const handleAddChild = async () => {
    if (!newChild) return;
    await addDoc(collection(db, "attending"), { name: newChild });
    setNewChild("");
  };

  // Clear attendance
  const handleClearAttendance = async () => {
    const batch = writeBatch(db);
    const snapshot = await getDocs(collection(db, "attending"));
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    setChildren([]);
  };

  return (
    <div style={{ padding: "20px", color: "#fff", fontFamily: "Arial, sans-serif" }}>
      <h1>Rapaura School Bike Bus Tracker</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Child name"
          value={newChild}
          onChange={(e) => setNewChild(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button onClick={handleAddChild} style={{ padding: "5px 10px", backgroundColor: "green", color: "white" }}>
          Attending
        </button>
        <button onClick={handleClearAttendance} style={{ padding: "5px 10px", marginLeft: "10px", backgroundColor: "red", color: "white" }}>
          Clear List
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Leader name"
          value={leader}
          onChange={(e) => setLeader(e.target.value)}
          style={{ padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Leader of the Day: {leader || "TBD"}</h2>
        <h3>Attending Children:</h3>
        <ul>
          {children.map(child => (
            <li key={child.id}>{child.name}</li>
          ))}
        </ul>
      </div>

      {isLoaded && userLocation && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={userLocation}
          zoom={15}
        >
          <Marker position={userLocation} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Ride;