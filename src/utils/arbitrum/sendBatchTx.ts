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

export async function sendBatchScript(): Promise<{
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

    console.log(contractAddr);

    // Step 2: Deploy the Vault contract
    const deployContractTxHash =
      await arbitrumSepoliaWalletClient.deployContract({
        abi: vaultAbi,
        account: signerAccount,
        bytecode: vaultBytecode,
      });
    console.log(deployContractTxHash);
    // Step 3: Send the first transaction (1 ether)
    const tx1 = await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18), // 1 ether in wei
      account: signerAccount,
    });
    console.log(`Transaction 1 sent: ${tx1}`);

    // Step 4: Check balance after the first transaction
    const balance1 = await arbitrumSepoliaPublicClient.getBalance({
      address: contractAddr,
    });

    if (balance1 === BigInt(0)) {
      throw new Error('Front-Running Detected!!!');
    }

    // Step 5: Call the claim function on the Vault
    const tx2 = await arbitrumSepoliaWalletClient.writeContract({
      address: contractAddr,
      abi: vaultAbi,
      functionName: 'claim',
      account: signerAccount,
    });
    console.log(`Transaction 2 (claim) sent: ${tx2}`);

    // Step 6: Send the third transaction (another 1 ether)
    const tx3 = await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerAccount,
    });
    console.log(`Transaction 3 sent: ${tx3}`);

    // Step 7: Send the fourth transaction (another 1 ether)
    const tx4 = await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerAccount,
    });
    console.log(`Transaction 4 sent: ${tx4}`);

    // Step 8: Check balance after the fourth transaction
    const balance4 = await arbitrumSepoliaPublicClient.getBalance({
      address: contractAddr,
    });

    if (balance4 === BigInt(0)) {
      throw new Error('Front-Running Detected!!!');
    }

    // Step 9: Call the claim function again on the Vault
    const tx5 = await arbitrumSepoliaWalletClient.writeContract({
      address: contractAddr,
      abi: vaultAbi,
      functionName: 'claim',
      account: signerAccount,
    });
    console.log(`Transaction 5 (claim) sent: ${tx5}`);

    // If everything is successful
    return { success: true, message: 'All transactions executed successfully' };
  } catch (error) {
    console.error('Error executing transactions:', error);
    return { success: false, message: String(error) };
  }
}

export default sendBatchScript;
