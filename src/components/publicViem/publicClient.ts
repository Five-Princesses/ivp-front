import { http, createPublicClient } from 'viem';
import { mainnet, sepolia, arbitrum, optimism } from 'viem/chains';

export const mainnetPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: mainnet,
  transport: http('https://ethereum.blockpi.network/v1/rpc/public'),
});

export const sepoliaPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: sepolia,
  transport: http(),
});

export const arbitrumPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: arbitrum,
  transport: http(),
});

export const optimismPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: optimism,
  transport: http(),
});
