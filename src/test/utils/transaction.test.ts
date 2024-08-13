import { TransactionEvent } from "../../types";
import {
  filteredValidPointsTransactions,
  getOrganizationsDonations,
  getTransactionsByAddress,
  getUsersDonations,
  setTransactions,
} from "../../utils/transaction";
import { BigNumber } from "@moralisweb3/core";

describe("Transaction", () => {
  const mockTransactions = [
    {
      transactionHash: "hash",
      sender: "0x123",
      receiver: "0x888",
      amount: BigNumber.create("6000000"),
      timestamp: BigNumber.create("1722551674"), // 2024-08-01 10:34:34 PM
    },
    {
      transactionHash: "hash",
      sender: "0x123",
      receiver: "0x888",
      amount: BigNumber.create("4000000"),
      timestamp: BigNumber.create("1722551900"), // 2024-08-01 10:38:20 PM
    },
    {
      transactionHash: "hash",
      sender: "0x456",
      receiver: "0x888",
      amount: BigNumber.create("5000000"),
      timestamp: BigNumber.create("1722563900"), // 2024-08-02 1:58:20 AM
    },
    {
      transactionHash: "hash",
      sender: "0x456",
      receiver: "0x888",
      amount: BigNumber.create("3000000"),
      timestamp: BigNumber.create("1724551900"), // 2024-8-25 02:11:40
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    setTransactions([...mockTransactions]);
  });

  it("should return transactions for a specific wallet address", () => {
    const result = getTransactionsByAddress("0x123");
    expect(result).toEqual([
      {
        transactionHash: "hash",
        sender: "0x123",
        receiver: "0x888",
        amount: "6000000",
        timestamp: "1722551674",
      },
      {
        transactionHash: "hash",
        sender: "0x123",
        receiver: "0x888",
        amount: "4000000",
        timestamp: "1722551900",
      },
    ]);
  });

  it("should compute the total donations per organization", () => {
    const result = getOrganizationsDonations();
    // (sqrt(6) + sqrt(5) + sqrt(3))**2 = 41.1856
    // the second transaction of 0x123 with amount 4_000_000 is not considered
    // because it was made by the same user within 7 days
    expect(result).toEqual([
      {
        address: "0x888",
        amount: "18000000",
        points: "41.19",
      },
    ]);
  });

  it("should compute the donations per user", () => {
    const result = getUsersDonations();
    expect(result).toEqual([
      {
        address: "0x123",
        amount: "10000000",
      },
      {
        address: "0x456",
        amount: "8000000",
      },
    ]);
  });
});

describe("filteredValidPointsTransactions", () => {
  it("should filter out transactions with less than 7 days interval for the same sender and receiver", () => {
    const transactions: TransactionEvent[] = [
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "Bob",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 8 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "David",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 6 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "Bob",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "David",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
    ];

    const result = filteredValidPointsTransactions(transactions);

    expect(result).toHaveLength(2);
    expect(result).toEqual([transactions[0], transactions[1]]);
  });

  it("should handle an empty list of transactions", () => {
    const transactions: TransactionEvent[] = [];
    const result = filteredValidPointsTransactions(transactions);
    expect(result).toHaveLength(0);
  });

  it("should return all transactions if they are beyond the 7-day interval and unsorted", () => {
    const transactions: TransactionEvent[] = [
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "Bob",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 8 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "David",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 10 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "Bob",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 20 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
      {
        transactionHash: "hash",
        sender: "Alice",
        receiver: "David",
        timestamp: BigNumber.create(
          Math.round((Date.now() - 20 * 24 * 60 * 60 * 1000) / 1000),
        ),
        amount: BigNumber.create("6000000"),
      },
    ];
    const result = filteredValidPointsTransactions(transactions);
    expect(result).toHaveLength(4);
  });
});
