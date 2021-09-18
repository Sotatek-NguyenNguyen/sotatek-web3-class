import { connectWallet, connectWithWalleConnect, deposit, getChainId, getNativeTokenBalance, getTokenBalance, withdraw } from "./web3";
import React, { useState, useEffect } from "react";
import './styles.css'

const App = () => {

  const [balance, setBalance] = useState('')
  const [account, setAccount] = useState('')
  const [ethBalance, setEthBalance] = useState('')
  const [wethBalance, setWethBalance] = useState('')
  const [amountDeposit, setAmountDeposit] = useState('');
  const [amountWithdraw, setAmountWithdraw] = useState('');
  const [anyWalletAddr, setAnyWalletAddr] = useState('')
  const [anyWalletAmount, setAnyWalletAmount] = useState('');
  const [queryTransferRS, setQueryTransferRS] = useState([])
  const [chainId, setChainId] = useState('')

  useEffect(() => {
    if (localStorage.getItem('account')?.length > 0) {
      setAccount(localStorage.getItem('account'))
    }
  }, [account, ethBalance, wethBalance, anyWalletAmount, amountWithdraw, amountDeposit])


  useEffect(async () => {
    if (account?.length > 0) {
      const ethBala = await getNativeTokenBalance(account);
      const wethBala = await getTokenBalance(account);
      const chainId = await getChainId(account)
      if (chainId) setChainId(chainId)
      if (ethBala) {
        setEthBalance(ethBala)
      }
      if (wethBala) setWethBalance(wethBala)
    }
  }, [account, ethBalance, wethBalance])

  return (
    <div className='App-container'>
      <div className="App">
        {
          !(account?.length > 0) ? (
            <>
              <button
                onClick={async () => {
                  const cnet = await connectWallet()
                  if (cnet) setAccount(cnet)
                }}
                className='btn'
              >
                Connect with Metamask
              </button>
              <button
                onClick={() => { connectWithWalleConnect() }}
                className='btn'
              >
                Connect with WalletConnect
              </button>
            </>
          ) : (
            <div>
              <div>
                {`Account: ${account}`}
              </div>
              <div>
                {`ETH balance: ${ethBalance}`}
              </div>
              <div>
                {`WETH balance: ${wethBalance}`}
              </div>
              <div>
                {`Network: ${chainId === 4 ? 'Rinkeby' : null}`}
              </div>

              <form>
                <input type='text' placeholder='input amount here' onChange={(e) => { setAmountDeposit(e.target.value) }} required />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    deposit(account, amountDeposit)
                  }}
                  className='btn'
                  type='submit'
                >
                  Deposit ETH
                </button>
              </form>

              <form>
                <input type='text' placeholder='input amount here' onChange={(e) => { setAmountWithdraw(e.target.value) }} required />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    withdraw(account, amountWithdraw)
                  }}
                  className='btn'
                  type='submit'
                >
                  Withdraw ETH
                </button>
              </form>

            </div>
          )
        }
      </div>

    </div>
  )
}

export default App;
