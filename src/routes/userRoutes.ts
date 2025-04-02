import { Router } from "express";
import {
  createUser,
  getUserByWallet,
  updateReputation,
} from "../controllers/userController";

const router = Router();

router.post("/users", createUser);
router.get("/users/:wallet", getUserByWallet);
router.patch("/users/:wallet/reputation", updateReputation);

export default router;
