import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { increaseReputationOnChain } from "../services/reputationService";

const prisma = new PrismaClient();

// POST /api/auctions
export const createAuction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { auctionId, title, description, imageUrl, seller } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { wallet: seller },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const auction = await prisma.auction.create({
      data: {
        auctionId,
        title,
        description,
        imageUrl,
        seller,
        userId: user.id,
      },
    });

    res.status(201).json(auction);
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/auctions
export const getAllAuctions = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const auctions = await prisma.auction.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(auctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/auctions/:id
export const getAuctionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      res.status(404).json({ error: "Auction not found" });
      return;
    }

    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/auctions/user/:wallet
export const getAuctionsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const wallet = req.params.wallet;

  try {
    const user = await prisma.user.findUnique({
      where: { wallet },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const auctions = await prisma.auction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/auctions/:id/confirm-delivery
export const confirmDelivery = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { wallet } = req.body;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!auction) {
      res.status(404).json({ error: "Auction not found" });
      return;
    }

    if (auction.seller !== wallet) {
      res.status(403).json({ error: "Only buyer can confirm delivery" });
      return;
    }

    await prisma.auction.update({
      where: { id },
      data: { deliveryConfirmed: true },
    });

    if (auction.user) {
      await increaseReputationOnChain(auction.user.wallet, 10);
    }

    res.json({ message: "Delivery confirmed and reputation updated." });
  } catch (error) {
    console.error("Error confirming delivery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
