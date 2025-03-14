// src/firebase/init.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore if needed

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAxcda4V8WxZscWrzwV0P6rXekeMBbMkkI",
  authDomain: "assignment-b7b46.firebaseapp.com",
  projectId: "assignment-b7b46",
  storageBucket: "assignment-b7b46.appspot.com",
  messagingSenderId: "181433169492",
  appId: "1:181433169492:web:a236f26fb286b52c069fc1",
  measurementId: "G-0BKC67F7K0",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (optional)
const analytics = getAnalytics(firebaseApp);

// Initialize Firebase Authentication and Firestore (if needed)
const auth = getAuth(firebaseApp); // Initialize Firebase Auth
const db = getFirestore(firebaseApp); // Initialize Firestore (optional)

// Export the initialized services for use in other components
export { firebaseApp, analytics, auth, db };
