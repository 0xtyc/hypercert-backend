import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeMoralis } from "./utils/moralis";
import {
  getDonations,
  getOrganizationsDonations,
  getTransactionsByAddress,
  getUsersDonations,
  handleWebhookRequest,
  initTransactions,
} from "./utils/transaction";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3002;

export const initializeApp = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  const apiKey = process.env.MORALIS_API_KEY;
  const chain = process.env.CHAIN_NAME;
  console.log(`This server is interacting with ${chain} chain`);

  if (!apiKey) {
    throw new Error("MORALIS_API_KEY is not defined");
  }
  if (!chain) {
    throw new Error("CHAIN_NAME is not defined");
  }
  await initializeMoralis(apiKey);
  await initTransactions(chain);

  app.get("/transactions", (req, res) => {
    const walletAddress = req.query.wallet
      ? (req.query.wallet as string).toLowerCase()
      : "";
    const filteredTransactions = getTransactionsByAddress(walletAddress);
    res.send(filteredTransactions);
  });

  app.get("/donations", (_req, res) => {
    const donations = getDonations();
    res.send(donations);
  });

  app.get("/donations/organizations", (_req, res) => {
    const orgDonations = getOrganizationsDonations();
    res.send(orgDonations);
  });

  app.get("/donations/users", (_req, res) => {
    const usersDonations = getUsersDonations();
    res.send(usersDonations);
  });

  app.post("/webhook", (req, res) => {
    res.sendStatus(200);
    handleWebhookRequest(req);
  });

  return app;
};

if (process.env.NODE_ENV !== "test") {
  initializeApp().then((app) => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  });
}
