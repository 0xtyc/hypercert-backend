import Moralis from "moralis";
import { TransactionEvent, TransactionSent } from "../types";
import { getAllTransactionEvents } from "./moralis";
import { BigNumber } from "@moralisweb3/core";
import { Request, Response } from "express";
import { getOrganizations } from "../constants/organizations";

let transactions: TransactionEvent[] = [];

export const getTransactions = () => transactions;

export const setTransactions = (newTransactions: TransactionEvent[]) => {
  transactions = newTransactions;
};

export const initTransactions = async (chain: string) => {
  try {
    transactions = await getAllTransactionEvents(chain);
  } catch (error) {
    console.error(error);
  }
};

export const getTransactionsByAddress = (walletAddress: string) => {
  const filteredTransactions = transactions.filter(
    (tx) => tx.sender.toLowerCase() === walletAddress,
  );

  return filteredTransactions.map((tx) => ({
    ...tx,
    amount: tx.amount.toString(),
    timestamp: tx.timestamp.toString(),
  }));
};

export const getOrganizationsDonations = () => {
  const totalPerReceiver = transactions.reduce(
    (totals: { [key: string]: BigNumber }, tx) => {
      const receiver = tx.receiver.toLowerCase();
      if (!totals[receiver]) {
        totals[receiver] = BigNumber.create(0);
      }
      totals[receiver] = totals[receiver].add(tx.amount);
      return totals;
    },
    {},
  );
  const organizations = getOrganizations();
  const donations = organizations.map((org) => ({
    organization: org.name,
    walletAddress: org.walletAddress,
    amount:
      totalPerReceiver[org.walletAddress.toLowerCase()]?.toString() || "0",
  }));

  return donations;
};

export const handleWebhookRequest = async (req: Request) => {
  try {
    const transactionLog = Moralis.Streams.parsedLogs<TransactionSent>(
      req.body,
    )[0];

    const tx = {
      transactionHash: req.body.logs[0].transactionHash,
      ...transactionLog,
    } as TransactionEvent;
    if (transactions.some((t) => t.transactionHash === tx.transactionHash)) {
      console.log("Transaction already received", tx);
    } else {
      transactions.push(tx);
      console.log("Received transaction", tx);
    }
  } catch (error) {
    console.log(error);
    console.log("Error parsing transaction", req.body);
  }
};
