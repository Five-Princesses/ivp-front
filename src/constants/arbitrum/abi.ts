export const getOwners = [
  {
    inputs: [],
    name: 'getOwners',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const getThreshold = [
  {
    inputs: [],
    name: 'getThreshold',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const createRetryableTicket = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'l2CallValue', type: 'uint256' },
      { internalType: 'uint256', name: 'maxSubmissionCost', type: 'uint256' },
      {
        internalType: 'address',
        name: 'excessFeeRefundAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'callValueRefundAddress',
        type: 'address',
      },
      { internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
      { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'createRetryableTicket',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export const depositEth = [
  {
    inputs: [],
    name: 'depositEth',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
];

export const submitRetryable = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'requestId', type: 'bytes32' },
      { internalType: 'uint256', name: 'l1BaseFee', type: 'uint256' },
      { internalType: 'uint256', name: 'deposit', type: 'uint256' },
      { internalType: 'uint256', name: 'callvalue', type: 'uint256' },
      { internalType: 'uint256', name: 'gasFeeCap', type: 'uint256' },
      { internalType: 'uint64', name: 'gasLimit', type: 'uint64' },
      { internalType: 'uint256', name: 'maxSubmissionFee', type: 'uint256' },
      { internalType: 'address', name: 'feeRefundAddress', type: 'address' },
      { internalType: 'address', name: 'beneficiary', type: 'address' },
      { internalType: 'address', name: 'retryTo', type: 'address' },
      { internalType: 'bytes', name: 'retryData', type: 'bytes' },
    ],
    name: 'submitRetryable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const timelock = [
  {
    inputs: [],
    name: 'timelock',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const getMinDelay = [
  {
    inputs: [],
    name: 'getMinDelay',
    outputs: [
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
