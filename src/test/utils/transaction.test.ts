import {
  getOrganizationsDonations,
  getTransactionsByAddress,
  setTransactions,
} from "../../utils/transaction";
import { BigNumber } from "@moralisweb3/core";

describe("Transaction", () => {
  const mockTransactions = [
    {
      transactionHash: "hash",
      sender: "0x123",
      receiver: "0x888",
      amount: BigNumber.create("100"),
      timestamp: BigNumber.create("5000"),
    },
    {
      transactionHash: "hash",
      sender: "0x456",
      receiver: "0x888",
      amount: BigNumber.create("100"),
      timestamp: BigNumber.create("8000"),
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
        amount: "100",
        timestamp: "5000",
      },
    ]);
  });

  it("should compute the total donations per organization", () => {
    const result = getOrganizationsDonations();
    expect(result).toEqual([
      {
        address: "0x888",
        amount: "200",
      },
    ]);
  });
});
