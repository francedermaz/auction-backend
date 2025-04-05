import { Router } from "express";
import {
  createDispute,
  getAllDisputes,
} from "../controllers/disputeController";

const router = Router();

router.post("/", createDispute);
router.get("/", getAllDisputes);

export default router;
