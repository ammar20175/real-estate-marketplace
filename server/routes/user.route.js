import express from "express";
import { verifyUser } from "../utils/verifyUser";
import { updateUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();

router.put("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);

export default router;
