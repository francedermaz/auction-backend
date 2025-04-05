import { Router } from "express";
import {
  createUser,
  getUserByWallet,
  getUserHistory,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.get("/:wallet", getUserByWallet);
router.get("/users/:wallet/history", getUserHistory);

export default router;
