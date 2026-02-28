import { Router } from "express";
import { adminLogin, createAdmin } from "../controllers/authentication/adminAuth.controller";
import signupUser from "../controllers/authentication/signup.controller";
import { userSignup } from "../controllers/authentication/login.controller";
import { userLogin, getUserById } from "../controllers/authentication/login.controller";

const router = Router();

router.post("/admin-login", adminLogin);
router.post("/user-signup",  userSignup); 
router.post("/user-login",userLogin)
router.post("/get-user/:id",getUserById)
router.get("/createAdmin",createAdmin );
export default router;
