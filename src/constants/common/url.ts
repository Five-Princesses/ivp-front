export const apiUrls = {
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
};

export const rpcUrls = {
  getEtherRpcUrl: () => 'https://ethereum.blockpi.network/v1/rpc/public',
  getArbiRpcUrl: () => 'https://arb1.arbitrum.io/rpc',
  getArbiSepoliaRpcUrl: () => 'https://sepolia-rollup.arbitrum.io/rpc',
};
