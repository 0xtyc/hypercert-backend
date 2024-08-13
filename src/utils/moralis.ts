import Moralis from "moralis";
import { ethers } from "ethers";
import { TransactionEvent } from "../types";
import { BigNumber } from "@moralisweb3/core";
import { eventABI } from "../constants/abi";
import { chainConfig } from "../constants/chains";

export const initializeMoralis = async (apiKey: string) => {
  await Moralis.start({
    apiKey: apiKey,
  });
};

export const getAllTransactionEvents = async (chain: string) => {
  const chainId = chainConfig[chain].chainId;
  const contractAddresses = chainConfig[chain].contractAddresses;
  const transactionList = contractAddresses.map(async (address) => {
    const response = await Moralis.EvmApi.events.getContractEvents({
      chain: chainId,
      address: address,
      abi: eventABI,
      topic: ethers.id("TransactionSent(address,address,uint256,uint256)"),
    });
    const transactions: TransactionEvent[] = response.raw.result.map(
      (event) => {
        const eventData = event.data as any;
        return {
          transactionHash: event.transaction_hash,
          sender: eventData.sender,
          receiver: eventData.receiver,
          amount: BigNumber.create(eventData.amount),
          timestamp: BigNumber.create(eventData.timestamp),
        } as TransactionEvent;
      },
    );

    return transactions;
  });

  const allTransactions = await Promise.all(transactionList);
  return allTransactions.flat();
};
