import { Router } from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  getAuctionsByUser,
} from "../controllers/auctionController";
import { checkReputation } from "../middlewares/checkReputation";

const router = Router();

router.post("/", checkReputation, createAuction);
router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);
router.get("/user/:wallet", getAuctionsByUser);

export default router;
