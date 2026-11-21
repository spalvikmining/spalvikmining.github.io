// ===== Spalvik Mining — Firebase connection (shared by every page) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBw3YUZk2ZWkWAxcc5Y561ouGojItnbi-I",
  authDomain: "spalvik-mining.firebaseapp.com",
  projectId: "spalvik-mining",
  storageBucket: "spalvik-mining.firebasestorage.app",
  messagingSenderId: "810909445895",
  appId: "1:810909445895:web:49ef1adb4d44cbb681dfa2"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Turn Firebase error codes into plain English
export function friendlyError(err) {
  const map = {
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-credential": "Wrong email or password.",
    "auth/wrong-password": "Wrong email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/popup-blocked": "Your browser blocked the Google pop-up. Allow pop-ups and try again.",
    "auth/unauthorized-domain": "This website address isn't authorised in Firebase yet.",
    "auth/network-request-failed": "Network problem. Check your internet connection.",
    "permission-denied": "Database permission denied — check the Firestore rules."
  };
  return map[err.code] || ("Something went wrong: " + (err.message || err));
}
