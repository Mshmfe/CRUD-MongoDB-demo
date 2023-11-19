import { Router } from "express";

import getAllProduct, {
  createSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  updateSingleProduct,
 
} from "../controllers/productController";

const router = Router();
//GET->/products -> :for get all the product
router.get("/", getAllProduct);
//GET->/products/:slug ->for get single product
router.get("/:slug", getSingleProduct);
//POST->for create new  product
router.post("/", createSingleProduct);
//DELETE->/products/:slug ->for delete single product
router.delete("/:slug", deleteSingleProduct);
//PUT->/products/:slug ->for update single product
router.put("/:slug", updateSingleProduct);


export default router;
