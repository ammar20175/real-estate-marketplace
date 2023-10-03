import express from "express";
import {
	googleSignin,
	signOut,
	signin,
	signup,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignin);
router.get("/signout", signOut);

export default router;
