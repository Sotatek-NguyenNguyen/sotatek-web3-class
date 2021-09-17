import { InjectedConnector } from '@web3-react/injected-connector';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export const provider = new WalletConnectProvider({
  infuraId: '305b5e9b47f34f1696974d3b695bee74',
  qrcodeModalOptions: {
    mobileLinks: [
      'rainbow',
      'metamask',
      'argent',
      'trust',
      'imtoken',
      'pillar',
    ],
  },
});

export const onConnectWalletConnect = async () => {
  try {
    await provider.enable();
  } catch (err: any) {
    console.log(err);
  }
};
