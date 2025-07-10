import * as Model from "../models/Medicines.js";

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
    res.status(404).json({ error: "The medina does not exist" });
  }
  res.json(medicine);
};
