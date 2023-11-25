import { Router } from "express";
import { createCategory, deleteSingleCategory, getAllCategory, getSingleCategory, updateCategory } from "../controllers/categoryController";
import { validateCreateCategory, validateUpdateCategory } from "../validation/categoryValidation";
import { runValidation } from "../validation/validation";

const router=Router();
//GET->/category=for get all the category
router.get('/',getAllCategory);

router.get('/:_id',getSingleCategory);

//POST-> /category= for create the category

router.post('/',validateCreateCategory,runValidation,createCategory);

//DELETE ->to delete category

router.delete('/:slug',deleteSingleCategory);

//PUT ->to update the single product
router.put('/:slug',validateUpdateCategory,runValidation,updateCategory)
export default router

