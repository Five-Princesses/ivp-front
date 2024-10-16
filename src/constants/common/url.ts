const apiUrls = {
  etherscanUrl: (
    address: string,
    startBlockNumber: bigint,
    latestBlockNumber: bigint,
    apiKey: string
  ) =>
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`,

  arbiscanUrl: (
    address: string,
    startBlockNumber: bigint,
    latestBlockNumber: bigint,
    apiKey: string
  ) =>
    `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`,
};

export default apiUrls;
