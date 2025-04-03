import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import disputeAbi from "./DisputeManagerABI.json";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const contract = new ethers.Contract(
  process.env.DISPUTE_CONTRACT_ADDRESS as string,
  disputeAbi,
  signer
);

contract.on("DisputeOpened", async (disputeId, auctionId, buyer, reason) => {
  console.log("📩 New Dispute Opened:", { disputeId, auctionId, buyer, reason });

  try {
    await prisma.dispute.create({
      data: {
        disputeId: Number(disputeId),
        auctionId: Number(auctionId),
        buyer,
        reason,
      },
    });
  } catch (error) {
    console.error("Error saving dispute:", error);
  }
});

contract.on("DisputeResolved", async (disputeId, favorBuyer) => {
  console.log("✅ Dispute Resolved:", { disputeId, favorBuyer });

  try {
    await prisma.dispute.update({
      where: { disputeId: Number(disputeId) },
      data: {
        resolved: true,
        favorBuyer,
      },
    });
  } catch (error) {
    console.error("Error updating dispute:", error);
  }
});

export const authorizeVoter = async (wallet: string) => {
  try {
    const tx = await contract.authorizeVoter(wallet);
    console.log("🔐 Voter authorized:", wallet);
    await tx.wait();
  } catch (error) {
    console.error("Error authorizing voter:", error);
  }
};
