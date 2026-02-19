import React, { useState } from "react";
import Login from "./Login.jsx";
import Ride from "./Ride.jsx";
import InfoPage from "./InfoPage.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login setUser={setUser} />;

  return <Ride user={user} />;
}