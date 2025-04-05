import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auctionRoutes from "./routes/auctionRoutes";
import userRoutes from "./routes/userRoutes";
import bidRoutes from "./routes/bidRoutes";
import disputeRoutes from "./routes/disputeRoutes";
import { Request, Response } from "express";
import "./eth/auctionListener";
import "./eth/disputeListener";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auctions", auctionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/disputes", disputeRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("API Online 🚀");
});

app.listen(3002, () => {
  console.log("Servidor backend corriendo en http://localhost:3002");
});
