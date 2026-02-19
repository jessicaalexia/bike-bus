// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these values with your Firebase web app config
const firebaseConfig = {
apiKey: "AIzaSyC2axeBaJ0oBFV7j9g2KZiov56u2rfxKvY",
  authDomain: "rapaura-school-bike-bus.firebaseapp.com",
  projectId: "rapaura-school-bike-bus",
  storageBucket: "rapaura-school-bike-bus.firebasestorage.app",
  messagingSenderId: "183156139194",
  appId: "1:183156139194:web:a1e118d4f1d56c2c04ce83",
  measurementId: "G-K7SS5PXZTP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);  