import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/bids/:id
export const placeBid = async (req: Request, res: Response): Promise<void> => {
  const { amount, wallet } = req.body;
  const auctionId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction) {
      res.status(404).json({ error: "Auction not found" });
      return;
    }

    const bid = await prisma.bid.create({
      data: {
        amount,
        userId: user.id,
        auctionId: auction.id,
      },
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET  /api/bids/:id
export const getBidsByAuction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auctionId = parseInt(req.params.id);

  try {
    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
