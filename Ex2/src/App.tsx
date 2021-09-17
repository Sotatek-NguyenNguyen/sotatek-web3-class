import React, { useEffect, useState } from 'react';
import './styles.css';
import { AppButton } from './components';
import { useWeb3React } from '@web3-react/core';
import {
  convertWeiToEth,
  deposit,
  getBalanceOfEth,
  getBalanceOfWeth,
  injected,
  onConnectWalletConnect,
  withdraw,
} from './wallet';
import { ReactComponent as ETH } from 'src/assets/eth.svg';
import { NETWORK } from './constants';
import { AppInput } from './components/app-input';

function App() {
  const { active, account, chainId, activate, deactivate } = useWeb3React();
  const [balanceOfEth, setBalanceOfEth] = useState('');
  const [balanceOfWeth, setBalanceOfWeth] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [amountOfDeposit, setAmountOfDeposit] = useState('');
  const [amountOfWithdraw, setAmountOfWithdraw] = useState('');
  const [loading, setLoading] = useState(false);

  const onConnectMetamask = async () => {
    try {
      await activate(injected);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      const balanceETH = await getBalanceOfEth(account ?? '');
      const balanceWETH = await getBalanceOfWeth(account ?? '');

      setBalanceOfEth(balanceETH ?? '');
      setBalanceOfWeth(balanceWETH ?? '');
      if (chainId) {
        setNetworkName(NETWORK[chainId]);
      }
      setLoading(false);
    };

    fetchBalance();
  }, [account, chainId]);

  const depositEth = async () => {
    setLoading(true);
    await deposit(amountOfDeposit);
    setLoading(false);
  };

  const withdrawEth = async () => {
    setLoading(true);
    await withdraw(amountOfWithdraw);
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="wallet">
        {!active ? (
          <>
            <div className="center mBottom8">
              <AppButton onClick={onConnectMetamask}>
                Connect with Metamask
              </AppButton>
            </div>
            <div className="center">
              <AppButton onClick={onConnectWalletConnect}>
                Connect with WalletConnect
              </AppButton>
            </div>
          </>
        ) : (
          <>
            <div className="center-text mBottom8 inline">
              <span className="text-green">Account</span>
              <span>: {account}</span>
            </div>
            <div className="center-text mBottom8 inline">
              <span className="text-green">ETH Balance</span>
              <span className="pRight4">: {convertWeiToEth(balanceOfEth)}</span>
              <ETH />
            </div>
            <div className="center-text mBottom8 inline">
              <span className="text-green">WETH Balance</span>
              <span className="pRight4">
                : {convertWeiToEth(balanceOfWeth)} WETH
              </span>
            </div>
            <div className="center-text mBottom8 inline">
              <span className="text-green">Network</span>
              <span className="pRight4">: {networkName}</span>
            </div>
            <div className="mBottom8">
              <AppInput
                fullwidth
                placeholder="Input amount here"
                value={amountOfDeposit}
                onChange={(e: any) => setAmountOfDeposit(e.target.value)}
              />
            </div>
            <div className="mBottom8">
              <AppButton onClick={depositEth} loading={loading}>
                Deposit ETH
              </AppButton>
            </div>
            <div className="mBottom8">
              <AppInput
                fullwidth
                placeholder="Input amount here"
                value={amountOfWithdraw}
                onChange={(e: any) => setAmountOfWithdraw(e.target.value)}
              />
            </div>
            <div className="mBottom8">
              <AppButton onClick={withdrawEth} loading={loading}>
                Withdraw ETH
              </AppButton>
            </div>
            <div className="center">
              <AppButton
                onClick={disconnect}
                className="button-disconnect"
                loading={loading}>
                Disconnect
              </AppButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
