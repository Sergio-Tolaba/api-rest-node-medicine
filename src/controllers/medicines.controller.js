import * as Model from "../models/Medicines.js";
import { prepareMedicineData } from "../services/prepare-medicine-data.js";

export const getAllMedicines = async (req, res) => {
  try {
    const { category } = req.query;
    const medicines = await Model.getAllMedicines();
    if (category) {
      const medicineFiltered = medicines.filter((item) =>
        item.categories.includes(category)
      );
      return res.json(medicineFiltered);
    }
    res.json(medicines);
  } catch (error) {
    console.error("Error in getAllMedicines:", error);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const id = req.params.id;
    const medicine = await Model.getMedicineById(id);

    if (!medicine) {
      res.status(404).json({ error: "The medicine does not exist" });
    }
    res.json(medicine);
  } catch (error) {
    console.error("Error n getMedicineById:", error);
    res.status(500).json({ error: "Failed to fetch medicine" });
  }
};

export const addMedicine = async (req, res) => {
  try {
    const incoming = req.body;
    const existing = await Model.findMedicineByName(incoming.name);

    if (existing) {
      const incomingPills = parseFloat(incoming.pills_ml || 0);

      const lastPurchaseDate = new Date(existing.purchase_date);
      const newPurchaseDate = new Date(incoming.purchase_date);
      const daysGone = Math.floor((newPurchaseDate - lastPurchaseDate) / (1000 * 60 * 60 * 24));
      const dailyDose = parseFloat(incoming.daily_dose || existing.daily_dose || 0);
      const oldPills = parseFloat(existing.pills_ml || 0);
      const oldRemainingStock = Math.max(0, oldPills - daysGone * dailyDose);

        const updatedTotalPills = oldRemainingStock + incomingPills;
      
      const mergedData = {
        name: existing .name,
        price: parseFloat(incoming.price || existing.price || 0),
        pills_ml: updatedTotalPills,
        purchase_date: incoming.purchase_date, 
        daily_dose: dailyDose,
        limit_stock: parseFloat(incoming.limit_stock || existing.limit_stock || 0),
        categories: incoming.categories || existing.categories || [],
        
        manual_stock_correction: parseFloat(incoming.manual_stock_correction || 0),
      };
        


      const updatedData = prepareMedicineData(mergedData);

      await Model.updateMedicineById(existing.id, updatedData);

      return res.status(200).json({
        message: "Medicine updated (stock merged)",
        id: existing.id,
        name: updatedData.name,
        price: updatedData.price, 
        estimated_stock: updatedData.estimated_stock,
        repurchase_date: updatedData.repurchase_date,
        created_display: updatedData.created_display,
      });
    } else {
      const newData = prepareMedicineData(incoming);
      const id = await Model.saveMedicine(newData);

      return res.status(201).json({
        message: "Registered new medicine",
        id,
        name: newData.name,
        price: newData.price,
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

export const deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Model.deleteMedicine(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not find" });
    }
    res
      .status(200)
      .json({
        message: `Medicine deleted successfully`,
        id: medicine.id,
        name: medicine.name,
      });
  } catch (error) {
    console.error("Error in deleteMedicine:", error);
    res.status(500).json({ error: "Failed to delete medicine" });
  }
};
