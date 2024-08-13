import Moralis from "moralis";
import { TransactionEvent, TransactionSent } from "../types";
import { getAllTransactionEvents } from "./moralis";
import { BigNumber } from "@moralisweb3/core";
import { Request } from "express";
import { ethers } from "ethers";

const TOKEN_DECIMALS = 6;
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

export const getDonations = () => {
  const donations = transactions.map((tx) => ({
    ...tx,
    amount: tx.amount.toString(),
    timestamp: tx.timestamp.toString(),
  }));
  return donations;
};

export const getOrganizationsDonations = () => {
  const amountPerReceiver = transactions.reduce(
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

  // square root the valid amounts, sum them up, and then square the sum to get the points
  // transactions made with the same sender and receiver within a week are considered invalid for points
  const pointsPerReceiver = filteredValidPointsTransactions(
    transactions,
  ).reduce(
    // key: receiver address
    (totals: { [key: string]: number }, tx) => {
      const receiver = tx.receiver.toLowerCase();
      if (!totals[receiver]) {
        totals[receiver] = 0;
      }
      totals[receiver] += Math.sqrt(
        parseFloat(ethers.formatUnits(tx.amount.toString(), TOKEN_DECIMALS)),
      );
      return totals;
    },
    {},
  );

  const donations = Object.keys(amountPerReceiver).map((key) => ({
    address: key,
    amount: amountPerReceiver[key].toString(),
    points: (pointsPerReceiver[key] ** 2).toFixed(2), //
  }));
  return donations;
};

export const getUsersDonations = () => {
  const amountPerSender = transactions.reduce(
    (totals: { [key: string]: BigNumber }, tx) => {
      const sender = tx.sender.toLowerCase();
      if (!totals[sender]) {
        totals[sender] = BigNumber.create(0);
      }
      totals[sender] = totals[sender].add(tx.amount);
      return totals;
    },
    {},
  );

  const donations = Object.keys(amountPerSender).map((key) => ({
    address: key,
    amount: amountPerSender[key].toString(),
  }));
  return donations;
};

export const filteredValidPointsTransactions = (
  transactions: TransactionEvent[],
) => {
  const MIN_DONATION_INTERVAL = 7 * 24 * 60 * 60 * 1000;
  const filteredGroupTx = transactions
    .map((tx) => {
      return {
        ...tx,
        key: tx.sender + tx.receiver,
      };
    })
    .sort((a, b) => {
      return a.timestamp.toBigInt() - b.timestamp.toBigInt() > 0 ? 1 : -1;
    })
    .reduce((group: { [key: string]: TransactionEvent[] }, tx) => {
      const { key, ...txData } = tx;
      if (!group[tx.key]) {
        group[tx.key] = [txData];
      } else {
        const lastDonationTime = new Date(
          parseInt(group[tx.key].slice(-1)[0].timestamp.mul(1000).toString()),
        );
        const currentDonationTime = new Date(
          parseInt(tx.timestamp.mul(1000).toString()),
        );
        if (
          currentDonationTime.getTime() - lastDonationTime.getTime() >=
          MIN_DONATION_INTERVAL
        ) {
          group[tx.key].push(txData);
        }
      }
      return group;
    }, {});

  const filteredTx: TransactionEvent[] = [];
  Object.keys(filteredGroupTx).forEach((key) => {
    filteredTx.push(...filteredGroupTx[key]);
  });

  return filteredTx;
};

export const handleWebhookRequest = async (req: Request) => {
  try {
    const transactionLogs = Moralis.Streams.parsedLogs<TransactionSent>(
      req.body,
    );
    transactionLogs.map((log, i) => {
      const tx = {
        transactionHash: req.body.logs[i].transactionHash,
        ...log,
      } as TransactionEvent;
      if (
        transactions.some(
          (t) =>
            t.transactionHash === tx.transactionHash &&
            t.receiver.toLowerCase() === tx.receiver.toLowerCase(),
        )
      ) {
        console.log("Transaction already received", tx);
      } else {
        transactions.push(tx);
        console.log("Received transaction", tx);
      }
    });
  } catch (error) {
    console.log(error);
    console.log("Error parsing transaction", req.body);
  }
};
