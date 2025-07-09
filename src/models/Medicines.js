import { db } from "./firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const medicinesCollection = collection(db, "medicines");
export const getAllMedicines = async () => {
  
  try {
    const snapshot = await getDocs(medicinesCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(error);
  }
};
