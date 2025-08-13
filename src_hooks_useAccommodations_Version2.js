import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  useEffect(() => {
    async function fetchAccommodations() {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userType = userDoc.data().userType;
      // Optionally, fetch feedback history
      const functions = getFunctions();
      const recommend = httpsCallable(functions, "recommendAccommodations");
      const response = await recommend({ userType });
      setAccommodations(response.data.accommodations);
    }
    fetchAccommodations();
  }, []);
  return accommodations;
}