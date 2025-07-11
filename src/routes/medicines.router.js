import { Router } from "express";
import {
  getAllMedicines,
  getMedicineById,
  addMedicine
} from "../controllers/medicines.controller.js";


const router = Router();
router.get("/medicines", getAllMedicines);
router.get("/medicines/:id", getMedicineById);
router.post("/medicines", addMedicine);

export default router;
