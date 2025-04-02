import { Router } from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  getAuctionsByUser,
} from "../controllers/auctionController";

const router = Router();

router.post("/", createAuction);
router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);
router.get("/user/:wallet", getAuctionsByUser);

export default router;
