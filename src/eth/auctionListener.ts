import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import abi from "./AuctionABI.json";

const prisma = new PrismaClient();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PROVIDER_URL = process.env.AMOY_RPC_URL!;

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

contract.on("AuctionEnded", async (id, winner, amount) => {
  console.log(`Auction ended: ID ${id}, Winner: ${winner}`);

  try {
    await prisma.auction.update({
      where: { auctionId: Number(id) },
      data: {
        ended: true,
      },
    });
  } catch (error) {
    console.error("Error updating auction status:", error);
  }
});

contract.on("DeliveryConfirmed", async (id) => {
  console.log(`Delivery confirmed for auction ID ${id}`);

  try {
    await prisma.auction.update({
      where: { auctionId: Number(id) },
      data: {
        deliveryConfirmed: true,
      },
    });
  } catch (error) {
    console.error("Error confirming delivery in DB:", error);
  }
});
