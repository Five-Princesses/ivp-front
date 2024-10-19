import axios from 'axios';

// 트랜잭션 타입 정의
interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  methodId: string;
}

export default async function fetchTransactionsByBlockRange(
  address: string,
  methodId: string,
  startBlock: number,
  endBlock: number,
  apiKey: string
): Promise<string[]> {
  const url = `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const transactions: Transaction[] = response.data.result;

    if (response.data.status !== '1') {
      throw new Error(`API Error: ${response.data.message}`);
    }

    // methodId가 일치하는 트랜잭션만 필터링
    const matchingTransactions = transactions
      .filter((tx: Transaction) => tx.input.startsWith(methodId))
      .map((tx: Transaction) => tx.hash);

    return matchingTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
