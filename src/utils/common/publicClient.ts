import { http, createPublicClient, createWalletClient } from 'viem';
import {
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
} from 'viem/chains';
import { rpcUrls } from '../../constants/common/url';

export const mainnetPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: mainnet,
  transport: http(rpcUrls.getEtherRpcUrl()),
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
  transport: http(rpcUrls.getArbiRpcUrl()),
});

export const arbitrumSepoliaPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: arbitrumSepolia,
  transport: http(rpcUrls.getArbiSepoliaRpcUrl()),
});

export const arbitrumSepoliaWalletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: http(rpcUrls.getArbiSepoliaRpcUrl()),
});

export const optimismPublicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: optimism,
  transport: http(),
});
