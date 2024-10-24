import { http, createPublicClient } from 'viem';
import { mainnet, sepolia, arbitrum, optimism } from 'viem/chains';
import { RPC_URLS } from '../../constants/common/url';

export const mainnetPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: mainnet,
  transport: http(RPC_URLS.getEtherRpcUrl()),
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
  transport: http(RPC_URLS.getArbiRpcUrl()),
});

export const optimismPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: optimism,
  transport: http(),
});
