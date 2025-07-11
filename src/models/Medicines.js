import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


const medicinesCollection = collection(db, "medicines");
export const getAllMedicines = async () => {
  try {
    const snapshot = await getDocs(medicinesCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(error);
  }
};
export const getMedicineById = async (id) => {
  try {
    const medicineRef = doc(medicinesCollection, id);
    const snapshot = await getDoc(medicineRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch (error) {
    console.error(error);
  }
};

export const saveMedicine = async (medicine) => {
  try {
    const docRef = await addDoc(medicinesCollection, medicine);
    return docRef.id;
  } catch (error) {
    console.error(error);
  }
};
