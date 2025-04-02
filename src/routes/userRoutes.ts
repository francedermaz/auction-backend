import { Router } from "express";
import {
  createUser,
  getReputation,
  getUserByWallet,
  getUserHistory,
  updateReputation,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.get("/:wallet", getUserByWallet);
router.patch("/:wallet/reputation", updateReputation);
router.get("/users/:wallet/reputation", getReputation);
router.get("/users/:wallet/history", getUserHistory);

export default router;
