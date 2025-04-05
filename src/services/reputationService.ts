import { ethers } from "ethers";
import dotenv from "dotenv";
import reputationAbi from "../eth/ReputationManagerABI.json";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const reputationContract = new ethers.Contract(
  process.env.REPUTATION_CONTRACT_ADDRESS as string,
  reputationAbi,
  signer
);

export const increaseReputationOnChain = async (
  userAddress: string,
  amount: number
) => {
  const tx = await reputationContract.increaseReputation(userAddress, amount);
  await tx.wait();
  console.log(`✅ Reputation increased on-chain for ${userAddress}`);
};
