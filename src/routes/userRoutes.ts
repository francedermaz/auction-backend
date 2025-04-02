import { Router } from "express";
import {
  createUser,
  getReputation,
  getUserByWallet,
  updateReputation,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.get("/:wallet", getUserByWallet);
router.patch("/:wallet/reputation", updateReputation);
router.get("/users/:wallet/reputation", getReputation);

export default router;
