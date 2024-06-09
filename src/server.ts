import express from "express";
import Moralis from "moralis";
import { getAllTransactionEvents } from "./utils/moralis";
import dotenv from "dotenv";
import { TransactionEvent, TransactionSent } from "./types";
import { BigNumber } from "@moralisweb3/core";
import { organizations } from "./constants/organizations";
import cors from "cors";

dotenv.config();

// Create an instance of the express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
    const walletAddress = req.query.wallet
      ? (req.query.wallet as string).toLowerCase()
      : undefined;

    // Filter transactions if wallet is provided
    const filteredTransactions = walletAddress
      ? transactions.filter((tx) => tx.sender === walletAddress)
      : transactions;

    // Convert BigNumber to string for JSON serialization
    res.send(
      filteredTransactions.map((tx) => ({
        ...tx,
        amount: tx.amount.toString(),
        timestamp: tx.timestamp.toString(),
      })),
    );
  });

  app.get("/organizations/donations", (req, res) => {
    const totalPerReceiver = transactions.reduce(
      (totals: { [key: string]: BigNumber }, tx) => {
        if (!totals[tx.receiver]) {
          totals[tx.receiver] = BigNumber.create(0);
        }
        totals[tx.receiver] = totals[tx.receiver].add(tx.amount);
        return totals;
      },
      {},
    );

    const donations = organizations.map((org) => ({
      organization: org.name,
      walletAddress: org.walletAddress,
      amount:
        totalPerReceiver[org.walletAddress.toLowerCase()]?.toString() || "0", // the wallet address is stored in lowercase in the transactions
    }));

    return res.send(donations);
  });

  app.get("/organizations", (req, res) => {
    res.send(organizations);
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
