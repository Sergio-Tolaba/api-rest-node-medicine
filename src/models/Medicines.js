import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc, 
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import calculateEstimatedStock from "../services/calculate-estimated-stock.js";

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
    console.error (error);
    
  }
};

export const addMedicine = async (req, res) => {
  try {
    const {
      name,
      price,
      purchase_date,
      current_stock,
      limit_stock,
      daily_dose,
      categories = [],
    } = req.body;

    const parsedMedicine = {
      name,
      price: parseFloat(price),
      purchase_date,
      current_stock: parseFloat(current_stock),
      limit_stock: parseFloat(limit_stock),
      daily_dose: parseFloat(daily_dose),
      categories,
      created: serverTimestamp(),
    };

    const estimated_stock = calculateEstimatedStock(parsedMedicine);

    const daysUntilLimit = Math.floor(
      (estimated_stock - parsedMedicine.limit_stock) / parsedMedicine.daily_dose
    );

    const repurchaseDate = new Date();
    repurchaseDate.setDate(repurchaseDate.getDate() + daysUntilLimit);

    const finalMedicine = {
      ...parsedMedicine,
      estimated_stock,
      repurchase_date: repurchaseDate.toISOString().split("T")[0],
    };

    const docRef = await addDoc(collection(db, "medicines"), finalMedicine);

    res.status(201).json({
      message: "Medicamento registrado",
      id: docRef.id,
      estimated_stock,
      repurchase_date: finalMedicine.repurchase_date,
    });
  } catch (error) {
    console.error("Error al registrar medicamento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
