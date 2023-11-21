import { Router } from "express";
import { createCategory, deleteSingleCategory, getAllCategory, getSingleCategory, updateCategory } from "../controllers/categoryController";

const router=Router();
//GE->/category=for get all the category
router.get('/',getAllCategory);

router.get('/:slug',getSingleCategory);

//POST-> /category= for create the category

router.post('/',createCategory);

//DELETE ->to delete category

router.delete('/:slug',deleteSingleCategory);

//PUT ->to update the single product
router.put('/:slug',updateCategory)
export default router

