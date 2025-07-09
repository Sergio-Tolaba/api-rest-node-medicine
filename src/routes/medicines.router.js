import {Router} from 'express'

const router = Router()

import { getAllMedicines
     //getAllCategories,
     //searchMedicines,
     //getMedicineById
     } from '../controllers/medicines.controller.js';
router.get("/medicines", getAllMedicines); 


export default router 

