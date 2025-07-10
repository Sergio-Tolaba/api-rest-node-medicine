import { Router } from "express";
import {
  getAllMedicines,
  getMedicineById
} from "../controllers/medicines.controller.js";
import { addMedicine,
         
 } from "../models/Medicines.js";

const router = Router();
router.get("/medicines", getAllMedicines);
router.get("/medicines/:id", getMedicineById);


router.post("/medicines", addMedicine);

export default router;
