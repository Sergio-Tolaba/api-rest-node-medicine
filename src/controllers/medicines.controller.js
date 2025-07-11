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
    const incoming = req.body;
    const existing = await Model.findMedicineByName(incoming.name);

    if (existing) {
      // Sumar stock
      const totalStock = parseFloat(existing.current_stock) + parseFloat(incoming.current_stock || 0);

      // Usamos la nueva fecha de compra y el nuevo stock
      const mergedData = {
        ...existing,
        ...incoming,
        current_stock: totalStock,
        purchase_date: incoming.purchase_date
      };

      const updatedData = prepareMedicineData(mergedData);

      await Model.updateMedicineById(existing.id, updatedData);

      return res.status(200).json({
        message: "Medicine updated (stock merged)",
        id: existing.id,
        estimated_stock: updatedData.estimated_stock,
        repurchase_date: updatedData.repurchase_date,
        created_display: updatedData.created_display,
      });
    } else {
      // Nueva medicina
      const newData = prepareMedicineData(incoming);
      const id = await Model.saveMedicine(newData);

      return res.status(201).json({
        message: "Registered new medicine",
        id,
        estimated_stock: newData.estimated_stock,
        repurchase_date: newData.repurchase_date,
        created_display: newData.created_display,
      });
    }
  } catch (error) {
    console.error("Error in addMedicine:", error);
    res.status(500).json({ error: "Failed to add or update medicine" });
  }
};

export const deleteMedicine = async (req,res)=>{
  const medicineId = req.params.id
  const medicine = await Model.deleteMedicine(medicineId)
  if(!medicine){
    return res.status(404).json({error:"Medicine not find"})
  }
  res.status(200).json({message: `Medicine deleted successfully`,
                        id: medicine.id,
                        name: medicine.name          
  })
} 