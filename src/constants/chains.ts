import { ChainConfig } from "../types";

export const chainConfig: ChainConfig  = {
    hardhat:{
        chainId: "1337",
        contractAddress: "0x5FbDB"
    },
    sepolia: {
        chainId: "11155111",
        contractAddress: "0xB4cc60e304D6c2923BB3651D6a2511A207a56199",
    },
    optimism:{
        chainId: "10",
        contractAddress: "0x2a730A170c205f28347BE567457a1b6c4f1690c3"
    }
}