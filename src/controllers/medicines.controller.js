import * as Model from "../models/Medicines.js";
import {calculateEstimatedStock,prepareMedicineData} from "../services/calculate-prepare.js";


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
    const medicineData = prepareMedicineData(req.body);
    const id = await Model.saveMedicine(medicineData);

    res.status(201).json({
      message: "Registered medicine",
      id,
      estimated_stock: medicineData.estimated_stock,
      repurchase_date: medicineData.repurchase_date,
      created_display: medicineData.created_display,
    });
  } catch (error) {
    console.error(error);
    
  }
};
