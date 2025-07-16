import { auth, db } from "@/firabase/config";
import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const checkAdminRights = async (listId: string, userId: string) => {
  const q = query(
    collection(db, "members"),
    where("userId", "==", userId),
    where("listId", "==", listId)
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs[0];

  if (data.exists()) {
    return data.data().role === "admin";
  }

  return false;
};

export default checkAdminRights;
