import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const userTypes = ["Deaf", "HoH", "Interpreter", "Ally", "DeafBlind"];

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(userTypes[0]);
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        // Use the 'options.data' field to pass userType to the webhook
        // that will create the user_profile record.
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_type: userType,
              accommodations: [], // Default value on signup
            },
          },
        });

        if (error) throw error;
        setMessage("Sign up successful! Please check your email to verify your account.");

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Signed in successfully!");
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      setError(error.message);
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
    } catch (error) {
        console.error("OAuth error:", error.message);
        setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleEmailAuth}>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {isSignUp && (
          <select value={userType} onChange={(e) => setUserType(e.target.value)} aria-label="User type">
            {userTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        )}
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={() => handleOAuth('google')}>Sign In with Google</button>
      <button onClick={() => handleOAuth('azure')}>Sign In with Azure</button>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
      </button>
    </div>
  );
}