import { getContractAddress } from 'viem';
import {
  arbitrumSepoliaPublicClient,
  arbitrumSepoliaWalletClient,
} from '../common/publicClient';

const signerPublicKey = import.meta.env.BATCH_TRANSACTION_TEST_PUBLIC_KEY;
const signerPrivateKey = import.meta.env.BATCH_TRANSACTION_TEST_PRIVATE_KEY;

// Vault contract ABI and bytecode
const vaultAbi = [
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

const vaultBytecode =
  '0x6080604052348015600f57600080fd5b50604051610203380380610203833981016040819052602c916050565b600080546001600160a01b0319166001600160a01b0392909216919091179055607e565b600060208284031215606157600080fd5b81516001600160a01b0381168114607757600080fd5b9392505050565b6101768061008d6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806363d9b77014610030575b600080fd5b61003861003a565b005b600080546040513260248201526001600160a01b039091169060440160408051601f198184030181529181526020820180516001600160e01b031663e8ebc47760e01b1790525161008b9190610111565b6000604051808303816000865af19150503d80600081146100c8576040519150601f19603f3d011682016040523d82523d6000602084013e6100cd565b606091505b505090508061010e5760405162461bcd60e51b81526020600482015260096024820152682330b4b632b217171760b91b604482015260640160405180910390fd5b50565b6000825160005b818110156101325760208186018101518583015201610118565b50600092019182525091905056fea264697066735822122003ee55a9c1bd085bcf7ff52cf0dbbf4ceba764775f902c2488f3643aa3de2e2f64736f6c634300081b0033';

export async function sendBatchScript(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Step 1: Get the contract address based on the transaction nonce
    const contractAddr = getContractAddress({
      from: signerPublicKey,
      nonce: BigInt(
        await arbitrumSepoliaPublicClient.getTransactionCount({
          address: signerPublicKey,
        })
      ),
    });

    // Step 2: Deploy the Vault contract
    await arbitrumSepoliaWalletClient.deployContract({
      abi: vaultAbi,
      account: signerPrivateKey,
      bytecode: vaultBytecode,
    });

    // Step 3: Send the first transaction (1 ether)
    const tx1 = await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18), // 1 ether in wei
      account: signerPrivateKey,
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
      account: signerPrivateKey,
    });
    console.log(`Transaction 2 (claim) sent: ${tx2}`);

    // Step 6: Send the third transaction (another 1 ether)
    const tx3 = await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerPrivateKey,
    });
    console.log(`Transaction 3 sent: ${tx3}`);

    // Step 7: Send the fourth transaction (another 1 ether)
    const tx4 = await arbitrumSepoliaWalletClient.sendTransaction({
      to: contractAddr,
      value: BigInt(1e18),
      account: signerPrivateKey,
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
      account: signerPrivateKey,
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
