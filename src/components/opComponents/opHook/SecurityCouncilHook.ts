import { ReadContractErrorType } from 'viem';
import {
  mainnetPublicClient,
  arbitrumPublicClient,
} from '../../publicViem/publicClient';

// ==================================getLatestTx==========================================

import getLatestL1Transactions from '../../publicViem/getLatestL1TX'; // Fetch optimized functions
import getLatestL2Transactions from '../../publicViem/getLatestOpTX';

// Fetch latest L1 transaction hashes
export async function fetchL1TransactionHashes(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashes = await getLatestL1Transactions(members);
    return transactionHashes.map(hash => hash || 'No Transaction');
  } catch (error) {
    console.error('Error fetching L1 transaction hashes:', error);
    return members.map(() => 'Error');
  }
}

// Fetch latest L2 transaction hashes
export async function fetchL2TransactionHashes(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashes = await getLatestL2Transactions(members);
    return transactionHashes.map(hash => hash || 'No Transaction');
  } catch (error) {
    console.error('Error fetching L2 transaction hashes:', error);
    return members.map(() => 'Error');
  }
}

// ====================================================================================

// ===================================Address==========================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
export const L1_SECURITY_COUNCIL_ADDRESS =
  '0xc2819DC788505Aac350142A7A707BF9D03E3Bd03';

// export const L2_SECURITY_COUNCIL_ADDRESS =
//   '0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641';

// export const L2_SECURITY_COUNCIL_PROPOSE_ADDRESS =
//   '0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941';

// ===================================ABI==========================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
const getOwnersABI = [
  {
    inputs: [],
    name: 'getOwners',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const getThresholdABI = [
  {
    inputs: [],
    name: 'getThreshold',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// ===================================Layer 1==========================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
export async function getMembersOfL1SecurityCouncil(): Promise<string[]> {
  try {
    const members = await mainnetPublicClient.readContract({
      address: L1_SECURITY_COUNCIL_ADDRESS,
      abi: getOwnersABI,
      functionName: 'getOwners',
    });
    return members as string[]; // 반환 타입을 string[]로 변환
  } catch (e) {
    const error = e as ReadContractErrorType;
    console.log(error.name);
    return []; // 에러 발생 시 빈 배열 반환
  }
}

export async function getThresholdOfL1SecurityCouncil(): Promise<bigint> {
  try {
    const threshold = await mainnetPublicClient.readContract({
      address: L1_SECURITY_COUNCIL_ADDRESS,
      abi: getThresholdABI,
      functionName: 'getThreshold',
    });
    return threshold as bigint;
  } catch (e) {
    const error = e as ReadContractErrorType;
    console.log(error.name);
    return -1n;
  }
}

export async function getBalanceOnL1({
  addr,
}: {
  addr: string;
}): Promise<bigint> {
  try {
    const balance = await mainnetPublicClient.getBalance({
      address: `0x${addr.slice(2)}`,
    });
    return balance as bigint;
  } catch (e) {
    const error = e as ReadContractErrorType;
    console.log(error.name);
    return -1n;
  }
}

// ===================================Layer 2==========================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
// export async function getMembersOfL2SecurityCouncil(): Promise<string[]> {
//   try {
//     const members = await arbitrumPublicClient.readContract({
//       address: L2_SECURITY_COUNCIL_ADDRESS,
//       abi: getOwnersABI,
//       functionName: 'getOwners',
//     });
//     return members as string[]; // 반환 타입을 string[]로 변환
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return []; // 에러 발생 시 빈 배열 반환
//   }
// }

// export async function getThresholdOfL2SecurityCouncil(): Promise<bigint> {
//   try {
//     const threshold = await arbitrumPublicClient.readContract({
//       address: L2_SECURITY_COUNCIL_ADDRESS,
//       abi: getThresholdABI,
//       functionName: 'getThreshold',
//     });
//     return threshold as bigint;
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return -1n;
//   }
// }

// export async function getMembersOfL2SecurityCouncilPropose(): Promise<
//   string[]
// > {
//   try {
//     const members = await arbitrumPublicClient.readContract({
//       address: L2_SECURITY_COUNCIL_PROPOSE_ADDRESS,
//       abi: getOwnersABI,
//       functionName: 'getOwners',
//     });
//     return members as string[]; // 반환 타입을 string[]로 변환
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return []; // 에러 발생 시 빈 배열 반환
//   }
// }

// export async function getThresholdOfL2SecurityCouncilPropose(): Promise<bigint> {
//   try {
//     const threshold = await arbitrumPublicClient.readContract({
//       address: L2_SECURITY_COUNCIL_PROPOSE_ADDRESS,
//       abi: getThresholdABI,
//       functionName: 'getThreshold',
//     });
//     return threshold as bigint;
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return -1n;
//   }
// }

export async function getBalanceOnL2({
  addr,
}: {
  addr: string;
}): Promise<bigint> {
  try {
    const balance = await arbitrumPublicClient.getBalance({
      address: `0x${addr.slice(2)}`,
    });
    return balance as bigint;
  } catch (e) {
    const error = e as ReadContractErrorType;
    console.log(error.name);
    return -1n;
  }
}