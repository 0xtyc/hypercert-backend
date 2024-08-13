import request from "supertest";
import { initializeMoralis } from "../utils/moralis";
import {
  getDonations,
  getOrganizationsDonations,
  getTransactionsByAddress,
  getUsersDonations,
  handleWebhookRequest,
  initTransactions,
} from "../utils/transaction";
import { initializeApp } from "../server";

jest.mock("moralis", () => ({
  start: jest.fn(),
  Streams: {
    parsedLogs: jest.fn().mockReturnValue({
      logs: [
        {
          transactionHash: "0x123",
        },
      ],
    }),
  },
}));

jest.mock("../utils/moralis", () => ({
  initializeMoralis: jest.fn(),
  getAllTransactionEvents: jest.fn(),
}));

jest.mock("../utils/transaction", () => ({
  initTransactions: jest.fn(),
  getTransactionsByAddress: jest.fn(),
  getOrganizationsDonations: jest.fn(),
  getDonations: jest.fn(),
  getUsersDonations: jest.fn(),
  handleWebhookRequest: jest.fn(),
}));

const mockTransactions = [
  {
    transactionHash: "0x123",
    sender: "0x123",
    receiver: "0x456",
    amount: "100",
    timestamp: "123456",
  },
];

describe("initializeApp", () => {
  let app: any;
  let server: any;
  beforeAll(async () => {
    app = await initializeApp();
    server = app.listen(0, () => {
      console.log("Server is listening on port 0");
    });
    jest.resetAllMocks();
    process.env.MORALIS_API_KEY = "testApiKey";
    process.env.CHAIN_NAME = "testChain";
  });

  afterAll(() => {
    server.close();
  });

  it("should start the server and initialize Moralis", async () => {
    await initializeApp();
    expect(initializeMoralis).toHaveBeenCalledWith("testApiKey");
    expect(initTransactions).toHaveBeenCalledWith("testChain");
  });

  it("should handle GET /transactions", async () => {
    (getTransactionsByAddress as jest.Mock).mockReturnValue(mockTransactions);
    const response = await request(app).get("/transactions");
    expect(response.status).toBe(200);
    expect(getTransactionsByAddress).toHaveBeenCalledWith("");
    expect(response.body).toEqual(mockTransactions);
  });

  it("should handle GET /transactions with wallet query", async () => {
    (getTransactionsByAddress as jest.Mock).mockReturnValue([]);
    const response = await request(app).get("/transactions?wallet=0x123");
    expect(response.status).toBe(200);
    expect(getTransactionsByAddress).toHaveBeenCalledWith("0x123");
    expect(response.body).toEqual([]);
  });

  it("should handle GET /donations/organizations", async () => {
    const mockOrgDonations = [
      {
        walletAddress: "0x123",
        amount: "100",
        points: "1",
      },
    ];
    (getOrganizationsDonations as jest.Mock).mockReturnValue(mockOrgDonations);
    const response = await request(app).get("/donations/organizations");
    expect(response.status).toBe(200);
    expect(getOrganizationsDonations).toHaveBeenCalled();
    expect(response.body).toEqual(mockOrgDonations);
  });

  it("should handle GET /donations", async () => {
    const mockDonations = [
      {
        sender: "0x123",
        receiver: "0x456",
        amount: "100",
        timestamp: "123456",
      },
    ];
    (getDonations as jest.Mock).mockReturnValue(mockDonations);
    const response = await request(app).get("/donations");
    expect(response.status).toBe(200);
    expect(getDonations).toHaveBeenCalled();
    expect(response.body).toEqual(mockDonations);
  });

  it("should handle GET /donations/users", async () => {
    const mockUsersDonations = [
      {
        address: "0x123",
        amount: "100",
      },
    ];
    (getUsersDonations as jest.Mock).mockReturnValue(mockUsersDonations);
    const response = await request(app).get("/donations/users");
    expect(response.status).toBe(200);
    expect(getUsersDonations).toHaveBeenCalled();
    expect(response.body).toEqual(mockUsersDonations);
  });

  it("should handle POST /webhook", async () => {
    const response = await request(app).post("/webhook");
    expect(response.status).toBe(200);
    expect(handleWebhookRequest).toHaveBeenCalled();
  });
});
