/*
import { ReadContractErrorType } from 'viem';
import {
  mainnetPublicClient,
  arbitrumPublicClient,
} from '../../publicViem/publicClient';

// ==================================getLatestTx==========================================

import {
  getLatestL1TransactionHash1,
  getLatestL1TransactionHash2,
  getLatestL1TransactionHash3,
} from '../../publicViem/getLatestL1TX';
import {
  getLatestL2TransactionHash1,
  getLatestL2TransactionHash2,
  getLatestL2TransactionHash3,
  getLatestL2TransactionHash4,
  getLatestL2TransactionHash5,
} from '../../publicViem/getLatestL2TX';

// 여러 멤버의 최신 트랜잭션 해시를 가져오는 함수 L1
export async function getSecurityCouncilL1LatestTxHash1(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL1TransactionHash1(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

export async function getSecurityCouncilL1LatestTxHash2(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL1TransactionHash2(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

export async function getSecurityCouncilL1LatestTxHash3(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL1TransactionHash3(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

//L2
export async function getSecurityCouncilL2LatestTxHash1(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL2TransactionHash1(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

export async function getSecurityCouncilL2LatestTxHash2(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL2TransactionHash2(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

export async function getSecurityCouncilL2LatestTxHash3(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL2TransactionHash3(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

export async function getSecurityCouncilL2LatestTxHash4(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL2TransactionHash4(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

export async function getSecurityCouncilL2LatestTxHash5(
  members: string[]
): Promise<string[]> {
  try {
    const transactionHashPromises = members.map((member: string) =>
      getLatestL2TransactionHash5(member)
    );

    const transactionHashes = await Promise.all(transactionHashPromises);
    return transactionHashes; // 각 멤버의 최신 트랜잭션 해시 배열을 반환
  } catch (error) {
    console.error('Error fetching Security Council transaction hashes:', error);
    return [];
  }
}

// ====================================================================================

// ===================================Address==========================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
export const L1_SECURITY_COUNCIL_ADDRESS =
  '0xF06E95eF589D9c38af242a8AAee8375f14023F85';

export const L2_SECURITY_COUNCIL_ADDRESS =
  '0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641';

export const L2_SECURITY_COUNCIL_PROPOSE_ADDRESS =
  '0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941';

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
export async function getMembersOfL2SecurityCouncil(): Promise<string[]> {
  try {
    const members = await arbitrumPublicClient.readContract({
      address: L2_SECURITY_COUNCIL_ADDRESS,
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

export async function getThresholdOfL2SecurityCouncil(): Promise<bigint> {
  try {
    const threshold = await arbitrumPublicClient.readContract({
      address: L2_SECURITY_COUNCIL_ADDRESS,
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

export async function getMembersOfL2SecurityCouncilPropose(): Promise<
  string[]
> {
  try {
    const members = await arbitrumPublicClient.readContract({
      address: L2_SECURITY_COUNCIL_PROPOSE_ADDRESS,
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

export async function getThresholdOfL2SecurityCouncilPropose(): Promise<bigint> {
  try {
    const threshold = await arbitrumPublicClient.readContract({
      address: L2_SECURITY_COUNCIL_PROPOSE_ADDRESS,
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

*/
