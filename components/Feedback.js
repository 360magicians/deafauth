import React, { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function Feedback() {
  const [text, setText] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "feedback"), {
      text,
      user: auth.currentUser?.uid || "anonymous",
      createdAt: new Date()
    });
    setText("");
    alert("Feedback sent!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Community Feedback</h2>
      <textarea
        placeholder="Share your thoughts..."
        value={text}
        onChange={e=>setText(e.target.value)}
        required
        aria-label="Feedback"
      />
      <button type="submit">Send Feedback</button>
    </form>
  );
}
