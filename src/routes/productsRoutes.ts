import { Router } from "express";

import getAllProduct, {
  createSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  updateSingleProduct,
 
} from "../controllers/productController";
import { upload } from "../middleware/uplodeImage";

const router = Router();
//GET->/products -> :for get all the product
router.get("/", getAllProduct);
//GET->/products/:slug ->for get single product
router.get("/:slug", getSingleProduct);
//POST->for create new  product
//when itry to create new product i want to upload image 
//in this case i can use the multer as midleware
//inside the single function put the name of the filed
router.post("/", upload.single('image'),createSingleProduct);
//DELETE->/products/:slug ->for delete single product
router.delete("/:slug", deleteSingleProduct);
//PUT->/products/:slug ->for update single product
router.put("/:slug", updateSingleProduct);


export default router;
