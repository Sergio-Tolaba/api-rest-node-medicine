import { Router } from "express";
import {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  deleteMedicine
} from "../controllers/medicines.controller.js";
//import { deleteMedicine } from "../models/Medicines.js";

const router = Router();
router.get("/medicines", getAllMedicines);
router.get("/medicines/:id", getMedicineById);
router.post("/medicines", addMedicine);
router.delete("/medicines/:id", deleteMedicine);

export default router;
