import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REPUTATION_THRESHOLD = 10;

// Middleware: Check if user has enough reputation OR is new (0 rep, no subastas)
export const checkReputation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { seller } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { wallet: seller },
      include: { auctions: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.reputation >= REPUTATION_THRESHOLD) {
      next();
      return;
    }

    const publishedAuctions = user.auctions.length;

    if (publishedAuctions === 0) {
      next();
      return;
    }

    res.status(403).json({
      error:
        "Low reputation. You must gain reputation before creating more auctions.",
    });
  } catch (error) {
    console.error("Error in checkReputation middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
