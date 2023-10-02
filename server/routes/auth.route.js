import express from "express";
import { googleSignin, signin, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignin);

export default router;
