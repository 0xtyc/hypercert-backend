import { ChainConfig } from "../types";

export const chainConfig: ChainConfig = {
  hardhat: {
    chainId: "1337",
    contractAddresses: ["0x123"],
  },
  sepolia: {
    chainId: "11155111",
    contractAddresses: [
      "0xB4cc60e304D6c2923BB3651D6a2511A207a56199",
      "0x53263AF748479BAdB5641ad604EFfcDFc92d7337",
    ],
  },
  optimism: {
    chainId: "10",
    contractAddresses: [
      "0x2a730A170c205f28347BE567457a1b6c4f1690c3",
      "0x49182E9F30923f8BfC88Ef21692C2A6EBe87892C",
    ],
  },
};
