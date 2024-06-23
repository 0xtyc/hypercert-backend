export const contractABI = [
  {
    inputs: [],
    name: "TransactionLogger__InsufficientOrExcessFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "TransactionLogger__MininumTransferAmountNotMet",
    type: "error",
  },
  {
    inputs: [],
    name: "TransactionLogger__MismatchedReceiversAndAmounts",
    type: "error",
  },
  {
    inputs: [],
    name: "TransactionLogger__TransactionFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TransactionSent",
    type: "event",
  },
  {
    inputs: [],
    name: "MINIMUM_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
    ],
    name: "sendFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable[]",
        name: "receivers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "sendMultiFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const eventABI = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: "address",
      name: "sender",
      type: "address",
    },
    {
      indexed: true,
      internalType: "address",
      name: "receiver",
      type: "address",
    },
    {
      indexed: false,
      internalType: "uint256",
      name: "amount",
      type: "uint256",
    },
    {
      indexed: false,
      internalType: "uint256",
      name: "timestamp",
      type: "uint256",
    },
  ],
  name: "TransactionSent",
  type: "event",
};
