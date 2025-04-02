import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/auctions
export const createAuction = async (req: Request, res: Response) => {
  try {
    const { auctionId, title, description, imageUrl, seller } = req.body;

    const auction = await prisma.auction.create({
      data: {
        auctionId,
        title,
        description,
        imageUrl,
        seller,
      },
    });

    res.status(201).json(auction);
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/auctions
export const getAllAuctions = async (_req: Request, res: Response) => {
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
export const getAuctionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) res.status(404).json({ error: "Auction not found" });

    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
