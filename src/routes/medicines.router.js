import {Router} from 'express'
import { getAllMedicines,

     } from '../controllers/medicines.controller.js';
import { addMedicine } from '../models/Medicines.js';


const router = Router()
router.get("/medicines", getAllMedicines); 

router.post("/medicines", addMedicine);


export default router 

