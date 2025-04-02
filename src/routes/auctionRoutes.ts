import { Router } from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
} from "../controllers/auctionController";

const router = Router();

router.post("/auctions", createAuction);
router.get("/auctions", getAllAuctions);
router.get("/auctions/:id", getAuctionById);

export default router;
