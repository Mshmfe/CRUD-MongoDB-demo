import { Router } from "express";

import {
  activateUser,
  banUser,
  deleteleUser,
  forgetPassword,
  getAllUser,
  getSingleUser,
  processRegisterUser,
  resetPassword,
  unbanUser,
} from "../controllers/userControllers";
import { uploadUser } from "../middleware/uplodeImage";
import { isAdmin, isLoggedIn, isLoggedOut } from "../middleware/auth";

const router = Router();

router.post(
  "/process-register",
  uploadUser.single("image"),
  isLoggedOut, //if you log out then i give you the access to the  processRegisterUser
  processRegisterUser
);
// to activate the user by token
router.post("/activate", activateUser);

router.get("/", isLoggedIn, isAdmin, getAllUser);
//for profile page
router.get("/:_id", isLoggedIn, getSingleUser);

router.delete("/:_id", isLoggedIn, isAdmin, deleteleUser);

router.put("/ban/:_id", isLoggedIn, isAdmin, banUser);

router.put("/unban/:_id", isLoggedIn, isAdmin, unbanUser);

//forget the password
router.post("/forget-password", isLoggedOut, forgetPassword);

//reset the password
router.put("/reset-password", isLoggedOut, resetPassword);
export default router;
