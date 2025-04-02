import { Router } from "express";
import {
  createUser,
  getUserByWallet,
  updateReputation,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.get("/:wallet", getUserByWallet);
router.patch("/:wallet/reputation", updateReputation);

export default router;
