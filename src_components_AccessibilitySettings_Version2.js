import React from "react";
import { useAccommodations } from "../hooks/useAccommodations";

export default function AccessibilitySettings() {
  const accommodations = useAccommodations();
  return (
    <div>
      <h2>Your Recommended Accommodations</h2>
      <ul>
        {accommodations.map(acc => <li key={acc}>{acc}</li>)}
      </ul>
      {/* UI settings toggles can use these */}
    </div>
  );
}
