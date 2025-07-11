import * as Model from "../models/Medicines.js";
import calculateEstimatedStock from "../services/calculate-estimated-stock.js";
import { serverTimestamp } from "firebase/firestore";

export const getAllMedicines = async (req, res) => {
  const { category } = req.query;
  const medicines = await Model.getAllMedicines();
  if (category) {
    const medicineFiltered = medicines.filter((item) =>
      item.categories.includes(category)
    );
    return res.json(medicineFiltered);
  }
  res.json(medicines);
};

//search

export const getMedicineById = async (req, res) => {
  const id = req.params.id
  const medicine = await Model.getMedicineById(id);
  
  if (!medicine) {
    res.status(404).json({ error: "The medicine does not exist" });
  }
  res.json(medicine);
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
    const createdAt = new Date();
    const createdFormatted = createdAt.toLocaleString("es-AR");

    const parsedMedicine = {
      name,
      price: parseFloat(price) || 0,
      purchase_date,
      current_stock: parseFloat(current_stock) || 0,
      limit_stock: parseFloat(limit_stock) || 0,
      daily_dose: parseFloat(daily_dose) || 0,
      categories,
      created: serverTimestamp(),
      created_display: createdFormatted,
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

    //const docRef = await addDoc(medicinesCollection, finalMedicine);
    const id = await Model.saveMedicine(finalMedicine)
    res.status(201).json({
      message: "Registered medicine",
      id,
      estimated_stock,
      repurchase_date: finalMedicine.repurchase_date,
      created_display: createdFormatted,
    });
  } catch (error) {
    console.error(error);
    
  }
};
