import { Router } from "express";
import {
  createDispute,
  getAllDisputes,
  resolveDispute,
} from "../controllers/disputeController";

const router = Router();

router.post("/", createDispute);
router.get("/", getAllDisputes);
router.patch("/:id", resolveDispute);

export default router;
