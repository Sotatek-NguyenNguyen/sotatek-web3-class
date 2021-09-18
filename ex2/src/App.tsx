import React from 'react'
import { useEagerConnect, useInactiveListener } from './hooks'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import abi from './abi.json'
import Web3 from "web3";
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

function getLibrary(provider: any): Web3 {
  const library = new Web3(provider)
  return library
}

export default function() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  )
}

function Network() {
  const { chainId } = useWeb3React()
  let networkName = "Unknown"
  switch (chainId) {
    case 1:
      networkName = "Main";
      break;
    case 2:
     networkName = "Morden";
     break;
    case 3:
      networkName = "Ropsten";
      break;
    case 4:
      networkName = "Rinkeby";
      break;
    case 42:
      networkName = "Kovan";
      break;
    default:
      networkName = "Unknown";
  }
  return (
    <>
      <span>Network:</span>
      <span>{networkName ?? ''}</span>
    </>
  )
}

function Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Account:</span>
      <span>
        {account}
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

      library
        .eth
        .getBalance(account)
        .then((balance: any) => {
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
      <span>ETH Balance:</span>
      <span>{balance === null ? 'Error' : balance ? `${library.utils.fromWei(balance, "ether")}` : ''}</span>
    </>
  )
}

function WethBalance() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState()
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false
      const contract = new library.eth.Contract(abi, "0xc778417e063141139fce010982780140aa0cd5ab");
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
      <span>WETH Balance:</span>
      <span>{balance === null ? 'Error' : balance ? `${library.utils.fromWei(balance, "ether")}` : ''}</span>
    </>
  )
}

function Deposit() {
  const { account, library } = useWeb3React()

  const [amount, setAmount] = React.useState<string>("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!!account && !!library) {
      const contract = new library.eth.Contract(abi, "0xc778417e063141139fce010982780140aa0cd5ab");
      
      contract.methods.deposit().send({ from: account, value: library.utils.toWei(amount, "ether") },  function(err: any, result: any){ 
        console.log(err, 'err');
        console.log(result, 'result');
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input placeholder="Input amount here" value={amount} onChange={(e: React.FormEvent) => {
          const element = e.currentTarget as HTMLInputElement;
          const value = element.value;
          setAmount(value);
        }} /><br/>
        <input type="submit" value="Deposit ETH" />
      </form>
    </>
  )
}

function Withdraw() {
  const { account, library } = useWeb3React()

  const [amount, setAmount] = React.useState<string>("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!!account && !!library) {
      const contract = new library.eth.Contract(abi, "0xc778417e063141139fce010982780140aa0cd5ab");
      console.log(amount, "amount");
      
      contract.methods.withdraw(library.utils.toWei(amount, "ether")).send({ from: account });
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
      <input placeholder="Input amount here" value={amount} onChange={(e: React.FormEvent) => {
          const element = e.currentTarget as HTMLInputElement;
          const value = element.value;
          setAmount(value);
        }} /><br/>
        <input type="submit" value="Withdraw ETH" />
      </form>
    </>
  )
}

function Header() {
  const { active, error } = useWeb3React()

  return (
    <>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
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
        <Account />
        <Balance />
        <WethBalance />
        <Network />
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
      <Deposit />
      <Withdraw />
      </h3>
    </>
  )
}

function App() {
  const context = useWeb3React<Web3>()
  const { connector,activate } = context

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
          
        })}

        
      </div>

    </>
  )
}
