import React, { useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const userTypes = ["Deaf", "HoH", "Interpreter", "Ally", "DeafBlind"];

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(userTypes[0]);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        userType,
        accommodations: [],
        createdAt: new Date()
      });
      alert("Registered!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in!");
    }
  };

  const handleGoogleAuth = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // If first login, set additional fields
    const ref = doc(db, "users", result.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: result.user.email,
        userType,
        accommodations: [],
        createdAt: new Date()
      });
    }
    alert("Signed in with Google!");
  };

  return (
    <div>
      <form onSubmit={handleEmailAuth}>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <select value={userType} onChange={e=>setUserType(e.target.value)} aria-label="User type">
          {userTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={handleGoogleAuth}>Sign In with Google</button>
      <button onClick={()=>setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
      </button>
    </div>
  );
}