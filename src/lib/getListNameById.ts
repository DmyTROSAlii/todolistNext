import { db } from "@/firabase/config";
import { doc, getDoc } from "@firebase/firestore";

const getListNameById = async (listId: string): Promise<string | null> => {
  try {
    const docRef = doc(db, 'lists', listId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.name as string;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export default getListNameById;