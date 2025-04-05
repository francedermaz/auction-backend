import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import abi from "./AuctionABI.json";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PROVIDER_URL = process.env.AMOY_RPC_URL!;

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

contract.on("AuctionEnded", async (id, winner, amount) => {
  console.log(
    `📣 AuctionEnded → ID: ${id}, Winner: ${winner}, Amount: ${amount}`
  );

  try {
    await prisma.auction.update({
      where: { auctionId: Number(id) },
      data: { ended: true },
    });

    console.log(`✅ Auction ${id} marked as ended in DB.`);
  } catch (error) {
    console.error("❌ Error updating auction status:", error);
  }
});

contract.on("DeliveryConfirmed", async (id, sellerAmount, feeAmount) => {
  console.log(`📦 DeliveryConfirmed → Auction ID: ${id}`);

  try {
    await prisma.auction.update({
      where: { auctionId: Number(id) },
      data: { deliveryConfirmed: true },
    });

    console.log(`✅ Auction ${id} marked as delivered in DB.`);
  } catch (error) {
    console.error("❌ Error updating delivery confirmation:", error);
  }
});
