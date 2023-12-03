import { Router } from "express";

import { handleLogin, handleLogout } from "../controllers/authController";
import { isLoggedOut } from "../middleware/auth";

const router = Router();

//POST->auth/login
router.post("/login", isLoggedOut, handleLogin);

//POST->auth/logout
router.post("/logout", handleLogout);

export default router;
