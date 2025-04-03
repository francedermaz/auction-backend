import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/disputes
export const createDispute = async (req: Request, res: Response): Promise<void> => {
  const { disputeId, auctionId, buyer, reason } = req.body;

  try {
    const existing = await prisma.dispute.findUnique({ where: { disputeId } });
    if (existing) {
      res.status(200).json(existing);
      return;
    }

    const dispute = await prisma.dispute.create({
      data: {
        disputeId,
        auctionId,
        buyer,
        reason,
      },
    });

    res.status(201).json(dispute);
  } catch (error) {
    console.error("Error creating dispute:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/disputes
export const getAllDisputes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(disputes);
  } catch (error) {
    console.error("Error fetching disputes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/disputes/:id
export const resolveDispute = async (req: Request, res: Response): Promise<void> => {
  const disputeId = parseInt(req.params.id);
  const { favorBuyer } = req.body;

  try {
    const updated = await prisma.dispute.update({
      where: { disputeId },
      data: {
        resolved: true,
        favorBuyer,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error resolving dispute:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
