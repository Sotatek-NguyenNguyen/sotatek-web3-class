import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { ABI_ARRAY, CONTRACT_ADDRESS } from './contracts'
function App() {
  let web3 = new Web3(Web3.givenProvider);
  const { ethereum } = window;
  const [address, setAddress] = useState("");
  const [statusTrans, setStatusTrans] = useState("Chưa gửi");
  const [netWorkId, setNetWorkId] = useState("");
  const [myContract, setMyContract] = useState(null);
  const [balance, setBalance] = useState("");
  const [depositStatus, setDepositStatus] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [errMsg, setErrMsg] = useState(null);
  const [weth, setWETHBalance] = useState(0);
  const [lastestBlock, setLastestBlock] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Chưa gửi');

  useEffect(() => {
    if (lastestBlock === 0) {
      getLastBlock();
    }
    console.log('lastedBlock', lastestBlock);
  }, [lastestBlock])
  const connectMetamask = async () => {
    if (ethereum) {
      web3 = new Web3(ethereum);
      await ethereum.enable();
      //  Get Accounts
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        setAddress(accounts[0]);
        var balance = await web3.eth.getBalance(accounts[0]);
        const result = web3.utils.fromWei(balance, 'ether');
        setBalance(result);
      }
      const netWorkId = await web3.eth.net.getNetworkType();
      setNetWorkId(netWorkId);

    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
  }
  const sendTransaction = async () => {
    await web3.eth.sendTransaction({
      from: '0x5b1d79E20b713AF5E75A8241C8Df9fAB46546beD', //tk 1
      to: '0x4059aB1C7195Cf1c7f6516871a155f81E9DBE9B2', //tk 2,
      value: '1000000000000'
    })
      .on('transactionHash', function (hash) {
        console.log('hash', hash);
        setStatusTrans('Đang gửi...')
      })
      .on('receipt', function (receipt) {
        console.log('receipt', receipt);
        setStatusTrans('Hoàn thành');
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        setStatusTrans('Confirmation');
      })
      .on('error', function (err) {
        setStatusTrans('Error');
      });
  }
  const createContract = () => {
    var myCnt = new web3.eth.Contract(ABI_ARRAY, CONTRACT_ADDRESS);
    myCnt.methods
      .totalSupply()
      .call()
      .then((currentSupply) => {
        const result = web3.utils.fromWei(currentSupply, 'ether');
        setWETHBalance(result);
      });
    setMyContract(myCnt);
  }
  const queryTop100 = () => {
    setTransactionStatus('Đang gửi...')
    var myCnt = new web3.eth.Contract(ABI_ARRAY, CONTRACT_ADDRESS);
    const top100 = lastestBlock - 100;
    myCnt.getPastEvents('Transfer', {
      fromBlock: top100,
      toBlock: 'latest'
    }).then(function (events) {
      console.log('events', events);
      setTransactionStatus('Thành công.!')
    });
  }
  const getLastBlock = async () => {
    var lasetBlock = await web3.eth.getBlockNumber();
    setLastestBlock(lasetBlock);
  }
  const depositETH = () => {
    const amount = web3.utils.toWei(deposit, 'ether');
    myContract.methods
      .deposit()
      .send({
        from: address,
        value: amount
      })
      .on("sent", function (send) {
        setDepositStatus("Desposit processing, Please wait... ");
      })
      .on("receipt", function (receipt) {
        const completeText = `Deposit Complete`
        setDepositStatus(completeText);
      })
      .on("error", function (error) {
        setErrMsg(error.message);
      });
  }
  const withdrawETH = () => {
    const amount = web3.utils.toWei(withdraw, 'ether');
    myContract.methods
      .withdraw(amount)
      .send({
        from: address,
      })
      .on("sent", function (send) {
        setWithdrawStatus("Withdraw processing, Please wait... ");
      })
      .on("receipt", function (receipt) {
        setWithdrawStatus("Withdraw Complete");
      })
      .on("error", function (error) {
        setErrMsg(error.message);
      });
  }
  return (
    <div className="App">
      <button onClick={() => connectMetamask()} className="btn-primary">connect metamask</button>
      <button onClick={() => createContract()} className="btn-primary">Create contract</button>
      <button onClick={() => sendTransaction()} className="btn-default">Send Transaction</button>
      <button onClick={() => queryTop100()} className="btn-default">Query transactions</button>
      <div className='box'>
        <table className='table'>
          <tr>
            <td>Account: </td>
            <td>{address}</td>
          </tr>
          <tr>
            <td>Balance:</td>
            <td>{balance} ETH</td>
          </tr>
          <tr>
            <td>Network: </td>
            <td>{netWorkId}</td>
          </tr>
          <tr>
            <td>Transaction status: </td>
            <td>{statusTrans}</td>
          </tr>
          <tr>
            <td>WETH  Balance:</td>
            <td>{weth} ETH</td>
          </tr>
          <tr>
            <td>Query Transaction:</td>
            <td>{transactionStatus}</td>
          </tr>
          <tr>
            <td>Deposit:</td>
            <td>
              <input defaultValue={0} onChange={(e) => setDeposit(e.target.value)} /> ETH
              <button onClick={() => depositETH()} style={{ marginLeft: '5px' }}>Deposit ETH</button> </td>
            <td>{depositStatus}</td>
          </tr>
          <tr>
            <td>Withdraw:</td>
            <td>
              <input defaultValue={0} onChange={(e) => setWithdraw(e.target.value)} />
              <button onClick={() => withdrawETH()} style={{ marginLeft: '5px' }}>Withdraw ETH</button> </td>
            <td>{withdrawStatus}</td>
          </tr>
          <tr>
            <td>Error message:</td>
            <td>{errMsg}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default App;
