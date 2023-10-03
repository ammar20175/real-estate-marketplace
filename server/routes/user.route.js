import express from "express";
import { verifyUser } from "../utils/verifyUser";
import { updateUser } from "../controllers/user.controller";

const router = express.Router();

router.put("/update/:id", verifyUser, updateUser);

export default router;
