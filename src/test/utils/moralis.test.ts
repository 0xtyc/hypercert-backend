import Moralis from "moralis";
import {
  getAllTransactionEvents,
  initializeMoralis,
} from "../../utils/moralis";

jest.mock("moralis", () => ({
  start: jest.fn(),
  EvmApi: {
    events: {
      getContractEvents: jest.fn(),
    },
  },
}));

describe("Moralis functions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should initialize Moralis with the provided API key", async () => {
    const mockApiKey = "testApiKey";
    await initializeMoralis(mockApiKey);
    expect(Moralis.start).toHaveBeenCalledWith({ apiKey: mockApiKey });
  });

  it("should get transaction events from moralis", async () => {
    const mockResponse = {
      raw: {
        result: [],
      },
    };
    (Moralis.EvmApi.events.getContractEvents as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    const transactions = await getAllTransactionEvents("hardhat");
    expect(Moralis.EvmApi.events.getContractEvents).toHaveBeenCalled();
    expect(transactions).toEqual([]);
  });
});
