import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createStorage, cookieStorage } from 'wagmi';

import {
  aurora,
  auroraTestnet,
} from 'wagmi/chains';

const supportedChains: Chain[] = [aurora, auroraTestnet];

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
   }),
  transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
 
});