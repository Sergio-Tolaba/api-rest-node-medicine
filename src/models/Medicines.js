import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  setDoc,
  deleteDoc
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
export const findMedicineByName = async (name) => {
  const q = query(medicinesCollection, where("name", "==", name));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docData = snapshot.docs[0];
  return {
    id: docData.id,
    ...docData.data(),
  };
};

export const updateMedicineById = async (id, data) => {
  const docRef = doc(medicinesCollection, id);
  await setDoc(docRef, data, { merge: true });
};

export const saveMedicine = async (data) => {
  const docRef = doc(medicinesCollection);
  await setDoc(docRef, data);
  return docRef.id;
};


export const deleteMedicine = async(id)=>{
  try {
    const medicineRef = doc(medicinesCollection, id)
    const snapshot = await getDoc(medicineRef)
    if (!snapshot.exists()){
      return false
    }
    const medicineData = snapshot.data()
    await deleteDoc(medicineRef)
    return {id, name:medicineData.name || "Name not available"}
  } catch (error) {
    console.error(error)
  }
}