import React from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useEagerConnect, useInactiveListener } from './hooks'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import Web3 from "web3";

import WETH_ABI from './contract/weth-abi.json'
import DD2_ABI from './contract/dd2-abi.json'
import MASTERCHEF_ABI from './contract/masterchef-abi.json'
const WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
const DD2_ADDRESS = "0xb1745657cb84c370dd0db200a626d06b28cc5872";
const MASTERCHEF_ADDRESS = "0x9da687e88b0A807e57f1913bCD31D56c49C872c2";
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string
}

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
})

enum ConnectorNames {
  Injected = 'Connect with Metamask',
  WalletConnect = 'Connect with WalletConnect'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

function getLibrary(provider: any): Web3 {
  const library = new Web3(provider)
  return library
}

export default function foo() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  )
}

function Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Wallet address</span>
      <span>
        {account!.substr(0,8)}
      </span>
    </>
  )
}

function Balance() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState()
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false
      const contract = new library.eth.Contract(WETH_ABI, WETH_ADDRESS);
      contract.methods.balanceOf(account).call().then((balance: any) => {
        if (!stale) {
          setBalance(balance)
        }
      })
      .catch(() => {
        if (!stale) {
          setBalance(undefined)
        }
      })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId])

  return (
    <>
      <span>Balance</span>
      <span>{balance === null ? 'Error' : balance ? `${library.utils.fromWei(balance, "ether")}` : ''} WETH</span>
    </>
  )
}

function StakeToken() {
  return (
    <>
      <span>Stake token</span>
      <span></span>
      <span></span>
      <span></span>
    </>
  )
}

function TokenEarned() {
  const { account, library, chainId } = useWeb3React()

  const [dd2, setDD2] = React.useState()
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false
      const contract = new library.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);
      
      contract.methods.pendingDD2(account).call().then((dd2: any) => {
        if (!stale) {
          setDD2(dd2)
        }
      })
      .catch(() => {
        if (!stale) {
          setDD2(undefined)
        }
      })

      return () => {
        stale = true
        setDD2(undefined)
      }
    }
  }, [account, library, chainId])

  return (
    <>
      <span>Token earned:</span>
      <span>{dd2 === null ? 'Error' : dd2 ? `${library.utils.fromWei(dd2, "ether")}`.substr(0, 10) : ''} DD2</span>
    </>
  )
}

function Harvest() {
  const { account, library } = useWeb3React()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!!account && !!library) {
      const contract = new library.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);
      
      contract.methods.deposit(0).send({ from: account },  function(err: any, result: any){ 
        console.log(err, 'err');
        console.log(result, 'result');
      })
    }
  }

  return (
    <>
      <form style={{ margin: 'auto' }} onSubmit={handleSubmit}>
        <input style={{
              height: '3rem',
              width: '7rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }} type="submit" value="Harvest" />
      </form>
    </>
  )
}

const contentStyle = {
  maxWidth: '600px',
  width: '90%',
  borderRadius: '1rem',
  padding: '1rem'
};

function Stake() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = React.useState();
  const [value, setValue] = React.useState("");

  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false
      const contract = new library.eth.Contract(WETH_ABI, WETH_ADDRESS);
      contract.methods.balanceOf(account).call().then((balance: any) => {
        if (!stale) {
          setBalance(balance)
        }
      })
      .catch(() => {
        if (!stale) {
          setBalance(undefined)
        }
      })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!!account && !!library) {
      const contract = new library.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);
      
      contract.methods.deposit(library.utils.toWei(value, "ether")).send({ from: account },  function(err: any, result: any){ 
        console.log(err, 'err');
        console.log(result, 'result');
      })
    }
  }

  return (
    <>
      <Popup
        trigger={
          <button
            style={{
              height: "5rem",
              width: "15rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            type="button"
            className="button"
          >
            Stake
          </button>
        }
        modal
        lockScroll={true}
        contentStyle={contentStyle}
        nested
      >
        <div className="modal">
          <div className="header"> Stake </div>
          <form style={{ margin: "auto" }} onSubmit={handleSubmit}>
            <input
              style={{
                height: "3rem",
                width: "30rem",
                marginTop: "2rem",
                border: "none",
                borderRadius: "3rem",
              }}
              value={value} 
              onChange={(e: React.FormEvent) => {
                const element = e.currentTarget as HTMLInputElement;
                const value = element.value;
                setValue(value);
              }}
              placeholder="Input here"
            ></input>
          </form>
        </div>
        <br />
        <br />
        <span>Your balance: {balance === null ? 'Error' : balance ? `${library.utils.fromWei(balance, "ether")}` : ''} WETH</span>
      </Popup>
    </>
  )
}


function Withdraw() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState()
  const [value, setValue] = React.useState("")

  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false
      const contract = new library.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);
      contract.methods.userInfo(account).call().then((balance: any) => {
        console.log(balance);
        
        if (!stale) {
          setBalance(balance.amount)
        }
      })
      .catch(() => {
        if (!stale) {
          setBalance(undefined)
        }
      })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!!account && !!library) {
      const contract = new library.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);
      
      console.log(library.utils.toWei(value, "ether"));
      
      contract.methods.withdraw(library.utils.toWei(value, "ether")).send({ from: account },  function(err: any, result: any){ 
        console.log(err, 'err');
        console.log(result, 'result');
      })
    }
  }

  return (
    <>
      <Popup
        trigger={
          <button
            style={{
              height: "5rem",
              width: "15rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            type="button"
            className="button"
          >
            Withdraw
          </button>
        }
        modal
        lockScroll={true}
        contentStyle={contentStyle}
        nested
      >
        <div className="modal">
          <div className="header"> Withdraw </div>
          <form style={{ margin: "auto" }} onSubmit={handleSubmit}>
            <input
              style={{
                height: "3rem",
                width: "30rem",
                marginTop: "2rem",
                border: "none",
                borderRadius: "3rem",
              }}
              value={value} 
              onChange={(e: React.FormEvent) => {
                const element = e.currentTarget as HTMLInputElement;
                const value = element.value;
                setValue(value);
              }}
              placeholder="Input here"
            ></input>
          </form>
          <br />
          <br />
          <span>Your balance: {balance === null ? 'Error' : balance ? `${library.utils.fromWei(balance, "ether")}` : ''} WETH</span>
        </div>
      </Popup>
    </>
  )
}

function StakeInfo() {
  const { account, library, chainId } = useWeb3React()

  const [stake, setStake] = React.useState("")
  const [total, setTotal] = React.useState("")

  React.useEffect((): any => {
    if (!!account && !!library) {
      const contract = new library.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);
      contract.methods.userInfo(account).call().then((balance: any) => {
        setStake(balance.amount)
      })
    }
  }, [account, library, chainId])
  React.useEffect((): any => {
    if (!!account && !!library) {
      const contract = new library.eth.Contract(DD2_ABI, DD2_ADDRESS);
      contract.methods.balanceOf(MASTERCHEF_ADDRESS).call().then((balance: any) => {
        setTotal(balance)
      })
    }
  }, [account, library, chainId])
  return(
    <div>
      <br />
      <br />
      <div>Share of pool  {(parseInt(stake) / parseInt(total) * 100).toPrecision(5)}%</div>
      <div>Your stake     {stake === null ? 'Error' : stake ? `${library.utils.fromWei(stake, "ether")}` : ''} Token</div>
      <div>Withdraw       {total === null ? 'Error' : total ? `${library.utils.fromWei(total, "ether")}`.substr(0,10) : ''} Token</div>
    </div>

  )
}

function Header() {
  const { active, error, library, account } = useWeb3React()

  const [approve, setApprove] = React.useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!!account && !!library) {
      const contract = new library.eth.Contract(WETH_ABI, WETH_ADDRESS);
      
      contract.methods.approve(MASTERCHEF_ADDRESS, "10000000000000000000000").send({ from: account },  function(err: any, result: any){ 
        setApprove(true);
        console.log(err, 'err');
        console.log(result, 'result');
      })
    }
  }
  
  return (
    <>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
      <h2 style={{ margin: 'auto', textAlign: 'center', color: 'red' }}>Please reload for changes after 1 operation</h2>
      <br />
      <br />
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          maxWidth: '40rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
        <Account />
        <Balance />
        <StakeToken />
        <TokenEarned />
        {!!approve && <Harvest />}
      </h3>
      <br />
      <br />
      <br />
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr',
          maxWidth: '40rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
      {!approve && <form style={{ margin: 'auto' }} onSubmit={handleSubmit}>
        <input style={{
              height: '5rem',
              width: '30rem',
              marginTop: '2rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }} type="submit" value="Approve" />
      </form>}
      </h3>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '40rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
      {!!approve && <Stake />}
      {!!approve && <Withdraw />}
      <StakeInfo />
      </h3>
    </>
  )
}

function App() {
  const context = useWeb3React<Web3>()
  const { connector, activate, error, deactivate, active } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <>
      {connector && <Header />}
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr',
          maxWidth: '30rem',
          margin: 'auto',
        }}
      >
      {Object.keys(connectorsByName).map((name) => {
          const currentConnector:string = (connectorsByName as any)[name];
          if (!connector) {
            return (
              <button
                style={{
                  height: '3rem',
                  borderRadius: '1rem',
                  borderColor: 'unset',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                key={name}
                onClick={() => {
                  setActivatingConnector(currentConnector)
                  activate((connectorsByName as any)[name])
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                    margin: '0 0 0 1rem',
                  }}
                ></div>
                {name}
              </button>
            )
          }
          return null;
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {(active || error) && (
          <button
            style={{
              height: '3rem',
              marginTop: '2rem',
              borderRadius: '1rem',
              borderColor: 'red',
              cursor: 'pointer'
            }}
            onClick={() => {
              deactivate()
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
      </div>
    </>
  )
}
