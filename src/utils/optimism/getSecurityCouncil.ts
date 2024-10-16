import { ReadContractErrorType } from 'viem';
import { mainnetPublicClient } from '../common/publicClient';

import { getOwners, getThreshold } from '../../constants/optimism/abi';
import { L1_SECURITY_COUNCIL_ADDRESS } from '../../constants/optimism/address';

// ===================================Layer 1==========================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
export async function getMembersOfL1SecurityCouncil(): Promise<string[]> {
  try {
    const members = await mainnetPublicClient.readContract({
      address: L1_SECURITY_COUNCIL_ADDRESS,
      abi: getOwners,
      functionName: 'getOwners',
    });
    return members as string[];
  } catch (e) {
    const error = e as ReadContractErrorType;
    console.log(error.name);
    return [];
  }
}

export async function getThresholdOfL1SecurityCouncil(): Promise<bigint> {
  try {
    const threshold = await mainnetPublicClient.readContract({
      address: L1_SECURITY_COUNCIL_ADDRESS,
      abi: getThreshold,
      functionName: 'getThreshold',
    });
    return threshold as bigint;
  } catch (e) {
    console.error('Failed to get L1 Security Council threshold:', e);
    throw new Error('Failed to retrieve L1 Security Council threshold');
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
//       abi: getOwners,
//       functionName: 'getOwners',
//     });
//     return members as string[];
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return [];
//   }
// }

// export async function getThresholdOfL2SecurityCouncil(): Promise<bigint> {
//   try {
//     const threshold = await arbitrumPublicClient.readContract({
//       address: L2_SECURITY_COUNCIL_ADDRESS,
//       abi: getThreshold,
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
//       abi: getOwners,
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
//       abi: getThreshold,
//       functionName: 'getThreshold',
//     });
//     return threshold as bigint;
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return -1n;
//   }
// }

// export async function getBalanceOnL2({
//   addr,
// }: {
//   addr: string;
// }): Promise<bigint> {
//   try {
//     const balance = await arbitrumPublicClient.getBalance({
//       address: `0x${addr.slice(2)}`,
//     });
//     return balance as bigint;
//   } catch (e) {
//     const error = e as ReadContractErrorType;
//     console.log(error.name);
//     return -1n;
//   }
// }
