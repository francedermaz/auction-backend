import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/users
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { wallet } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { wallet } });
    if (existing) {
      res.status(200).json(existing);
      return;
    }

    const user = await prisma.user.create({
      data: { wallet },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/users/:wallet
export const getUserByWallet = async (
  req: Request,
  res: Response
): Promise<void> => {
  const wallet = req.params.wallet;

  try {
    const user = await prisma.user.findUnique({ where: { wallet } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/users/:wallet/reputation
export const updateReputation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const wallet = req.params.wallet;
  const { reputation } = req.body;

  try {
    const user = await prisma.user.update({
      where: { wallet },
      data: { reputation },
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating reputation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
