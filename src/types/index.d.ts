import { BigNumber } from "@moralisweb3/core";

export interface ChainConfig {
  [key: string]: {
    chainId: string;
    contractAddress: string;
  };
}

export interface TransactionEvent extends TransactionSent {
  transactionHash: string;
}

export interface TransactionSent {
  sender: string;
  receiver: string;
  amount: BigNumber;
  timestamp: BigNumber;
}

export interface Organization {
  name: string;
  description: string;
  walletAddress: string;
}
