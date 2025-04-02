import { Router } from "express";
import { placeBid, getBidsByAuction } from "../controllers/bidController";

const router = Router();

router.post("/:id", placeBid);
router.get("/:id", getBidsByAuction);

export default router;
