import { getContractAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
  arbitrumSepoliaPublicClient,
  arbitrumSepoliaWalletClient,
} from '../common/publicClient';

const signerPublicKey = `0x${
  import.meta.env.VITE_BATCH_TRANSACTION_TEST_PUBLIC_KEY
}` as `0x${string}`;
const signerPrivateKey =
  `0x${import.meta.env.VITE_BATCH_TRANSACTION_TEST_PRIVATE_KEY}` as `0x${string}`;

const signerAccount = privateKeyToAccount(signerPrivateKey);

// Vault contract ABI and bytecode
const vaultAbi = [
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

const vaultBytecode =
  '0x6080604052348015600f57600080fd5b5060b980601d6000396000f3fe60806040526004361060205760003560e01c80634e71d92d14602b57600080fd5b36602657005b600080fd5b348015603657600080fd5b50603d603f565b005b60405133904790600081818185875af1925050503d8060008114607e576040519150601f19603f3d011682016040523d82523d6000602084013e505050565b50505056fea26469706673582212208dace90ceeff58389b61b6a46361316495cd76f7b7a952a2b412ef9346897e2864736f6c634300081b0033';

async function sendBatchTx(
  onProgress: (message: string, isSuccess?: boolean) => void
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const signerNonce = await arbitrumSepoliaPublicClient.getTransactionCount({
      address: signerPublicKey,
    });

    // Step 1: Get the contract address based on the transaction nonce
    const contractAddr = getContractAddress({
      from: signerAccount.address,
      nonce: BigInt(signerNonce),
    });

    // 트랜잭션 진행 알림 (Vault Contract 배포)
    onProgress('Deploying Vault contract...');
    await arbitrumSepoliaWalletClient.deployContract({
      abi: vaultAbi,
      account: signerAccount,
      bytecode: vaultBytecode,
    });
    onProgress('Deploy Vault Contract', true);

    // 첫 번째 트랜잭션
    onProgress('Sending Transaction 1...');
    await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerAccount,
    });
    onProgress('Transaction 1 Sent', true);

    // 잔액 확인 후 에러 처리
    const balance1 = await arbitrumSepoliaPublicClient.getBalance({
      address: contractAddr,
    });
    if (balance1 === BigInt(0)) {
      throw new Error('Front-Running Detected!!!');
    }

    // 클레임 함수 실행 (첫 번째 클레임)
    onProgress('Calling Claim Function...');
    await arbitrumSepoliaWalletClient.writeContract({
      address: contractAddr,
      abi: vaultAbi,
      functionName: 'claim',
      account: signerAccount,
    });
    onProgress('Claim Function Called', true);

    // 두 번째 트랜잭션
    onProgress('Sending Transaction 2...');
    await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerAccount,
    });
    onProgress('Transaction 2 Sent', true);

    // 세 번째 트랜잭션
    onProgress('Sending Transaction 3...');
    await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerAccount,
    });
    onProgress('Transaction 3 Sent', true);

    // 두 번째 클레임 트랜잭션 실행
    onProgress('Calling Claim Function Again...');
    await arbitrumSepoliaWalletClient.writeContract({
      address: contractAddr,
      abi: vaultAbi,
      functionName: 'claim',
      account: signerAccount,
    });
    onProgress('Claim Function Called Again', true);

    return { success: true, message: 'All transactions executed successfully' };
  } catch (error) {
    console.error('Error executing transactions:', error);
    return { success: false, message: String(error) };
  }
}

export default sendBatchTx;
