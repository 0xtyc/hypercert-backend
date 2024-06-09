import express from "express";
import Moralis from "moralis";
import { getAllTransactionEvents } from "./utils/moralis";
import dotenv from "dotenv";
import { TransactionEvent, TransactionSent } from "./types";

dotenv.config();

// Create an instance of the express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3002;

let transactions: TransactionEvent[] = [];

// Add this a startServer function that initialises Moralis
const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  try {
    transactions = await getAllTransactionEvents();
  } catch (error) {
    console.error(error);
  }

  app.get("/transactions", (req, res) => {
    // Convert BigNumber to string for JSON serialization
    res.send(
      transactions.map((tx) => ({
        ...tx,
        amount: tx.amount.toString(),
        timestamp: tx.timestamp.toString(),
      })),
    );
  });

  // for moralis webhook
  app.post("/webhook", async (req, res) => {
    const transactionLog = Moralis.Streams.parsedLogs<TransactionSent>(
      req.body,
    )[0]; // only one emitted event

    const tx = {
      transactionHash: req.body.txs[0].hash,
      ...transactionLog,
    } as TransactionEvent;
    if (transactions.some((t) => t.transactionHash === tx.transactionHash)) {
      console.log("Transaction already received", tx);
    } else {
      transactions.push(tx);
      console.log("Received transaction", tx);
    }

    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log(`Hypercert server is listening on port ${port}`);
  });
};

startServer();
