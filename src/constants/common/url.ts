export const API_URLS = {
  getEtherTxUrl: (
    address: string,
    startBlockNumber: bigint,
    latestBlockNumber: bigint,
    apiKey: string
  ) =>
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`,

  getArbiTxUrl: (
    address: string,
    startBlockNumber: bigint,
    latestBlockNumber: bigint,
    apiKey: string
  ) =>
    `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`,

  getBlobscanVersionedHashUrl: (versionedHash: string) =>
    `https://api.blobscan.com/blobs/${versionedHash}`,

  getBlobscanTxHashUrl: (txHash: string) =>
    `https://api.blobscan.com/transactions/${txHash}`,

  getEtherscanAddressUrl: (address: string) =>
    `https://etherscan.io/address/${address}`,

  getArbiscanAddressUrl: (address: string) =>
    `https://arbiscan.io/address/${address}`,

  getOptimismScanAddressUrl: (address: string) =>
    `https://optimistic.etherscan.io/address/${address}`,

  getArbiscanAddressTxUrl: (
    address: string,
    startBlock: bigint,
    endBlock: bigint,
    apiKey: string
  ) =>
    `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=1&offset=10&sort=asc&apikey=${apiKey}`,

  getArbiscanTxByHash: (txhash: string, apiKey: string) =>
    `https://api.arbiscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txhash}&apikey=${apiKey}`,

  getEtherscanTxUrl: (address: string) => `https://etherscan.io/tx/${address}`,

  getArbiscanTxUrl: (address: string) => `https://arbiscan.io/tx/${address}`,

  getTallyUrl: (onchainId: string) =>
    `https://www.tally.xyz/gov/arbitrum/proposal/${onchainId}?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9`,

  getTallyQueryUrl: () => `https://api.tally.xyz/query`,
};

export const RPC_URLS = {
  getEtherRpcUrl: () => 'https://ethereum.blockpi.network/v1/rpc/public',
  getArbiRpcUrl: () => 'https://arb1.arbitrum.io/rpc',
};
