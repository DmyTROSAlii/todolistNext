import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { db } from "@/firabase/config";

import { List } from "./types";

const fetchUserListsLive = (
  userId: string,
  callback: (lists: List[]) => void
) => {
  const q = query(collection(db, "members"), where("userId", "==", userId));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const listIds = snapshot.docs.map((doc) => doc.data().listId as string);

    const listPromises = listIds.map(async (listId) => {
      const listRef = doc(db, "lists", listId);
      const listSnap = await getDoc(listRef);

      if (listSnap.exists()) {
        return {
          ...(listSnap.data() as List),
          id: listSnap.id,
        };
      }

      return null;
    });

    const lists = (await Promise.all(listPromises)).filter(Boolean) as List[];
    callback(lists);
  });

  return unsubscribe;
};

export default fetchUserListsLive;
