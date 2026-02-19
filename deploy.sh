#!/bin/bash

# Step 1: Go to project root
cd /Users/jessmorgan/Desktop/bike-bus || exit

echo "✅ In project folder"

# Step 2: Clear Vite and dist cache
rm -rf node_modules/.vite
rm -rf dist
echo "🧹 Cleared old build cache"

# Step 3: Replace Ride.jsx with clean version
cat > src/Ride.jsx << 'EOF'
import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function Ride() {
  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState("");
  const [leader, setLeader] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "attending"), (snapshot) => {
      setChildren(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
      );
    });
    return () => unsub();
  }, []);

  const markAttending = async () => {
    if (!newChild) return;
    await addDoc(collection(db, "attending"), { name: newChild });
    setNewChild("");
  };

  const selectLeader = () => {
    if (children.length > 0) setLeader(children[0].name);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f5f5f5", border: "3px solid green", borderRadius: "12px", padding: "15px", marginBottom: "20px", boxShadow: "4px 4px 10px rgba(0,0,0,0.2), -4px -4px 10px rgba(255,255,255,0.5)", color: "#333" }}>
        <h2 style={{ color: "green", marginBottom: "10px" }}>Rapaura School Bike Bus Tracker</h2>
        <p>Welcome! This tracker shows who is attending the Bike Bus each day. Children can mark themselves as attending, and the leader of the day will be highlighted on the map.</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Child name"
          value={newChild}
          onChange={(e) => setNewChild(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          onClick={markAttending}
          style={{ padding: "8px 12px", borderRadius: "5px", backgroundColor: "green", color: "#fff", border: "none", marginRight: "10px" }}
        >
          Attending
        </button>
        <button
          onClick={selectLeader}
          style={{ padding: "8px 12px", borderRadius: "5px", backgroundColor: "red", color: "#fff", border: "none" }}
        >
          Leader of the Day
        </button>
      </div>

      <h3>Attending Children:</h3>
      <ul>
        {children.map((child) => (
          <li key={child.id}>{child.name}</li>
        ))}
      </ul>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px", marginTop: "20px" }}
          center={{ lat: -41.5, lng: 173.9 }}
          zoom={14}
        >
          {leader && (
            <Marker
              position={{ lat: -41.5, lng: 173.9 }}
              label={{ text: `Leader: ${leader}`, color: "white", fontWeight: "bold" }}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
            />
          )}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}
EOF

echo "✅ Ride.jsx replaced with clean build-safe version"

# Step 4: Commit & push
git add src/Ride.jsx
git commit -m "Replace Ride.jsx with clean build-safe version"
git push origin main

echo "✅ Changes pushed to GitHub. Now redeploy on Vercel!"