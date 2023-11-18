import { Router } from "express";

import getAllProduct, {
  createSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  updateSingleProduct,
 
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);
router.post("/", createSingleProduct);
router.delete("/:id", deleteSingleProduct);
router.put("/:id", updateSingleProduct);


export default router;
