import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const increaseReputation = async (wallet: string, points: number) => {
  return prisma.user.update({
    where: { wallet },
    data: {
      reputation: {
        increment: points,
      },
    },
  });
};