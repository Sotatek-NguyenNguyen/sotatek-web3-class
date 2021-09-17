import Web3 from 'web3';
import BigNumber from "bignumber.js";
import abi from '../../contract/abi/abi.json'
const Tx = require('ethereumjs-tx').Transaction

const HTTPS_NODE_PROVIDER = `${process.env.ENDPOINT_HTTPS}/${process.env.PROJECT_SECRET_KEY}`;
const SOCKET_NODE_PROVIDER = `${process.env.ENDPOINT_SOCKET}/${process.env.PROJECT_SECRET_KEY}`;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = JSON.parse(abi.result);
const ACCOUNT_PRIVATE_KEY = new Buffer(process.env.ACCOUNT_PRIVATE_KEY || '', 'hex');
const DECIMAL = 18;

// for https
const web3 = new Web3(new Web3.providers.HttpProvider(HTTPS_NODE_PROVIDER));
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// for web socket
const web3Socket = new Web3(new Web3.providers.WebsocketProvider(SOCKET_NODE_PROVIDER));
export const instance = new web3Socket.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export const isMetaMaskInstalled = (ethereum:any) => {
  return Boolean(ethereum && ethereum.isMetaMask)
}

export const connectWallet = async (ethereum: any) => {
  try {
    const metamaskClientCheck = isMetaMaskInstalled(ethereum)
    if (metamaskClientCheck) {
      return await ethereum.request({ method: 'eth_requestAccounts' })
    }
  } catch (error) {
    throw error
  }
}

export const parseAddress = (address:string) => {
  const headAddress = address.substr(0, 6)
  const tailAddress = address.substr(address.length - 6)
  return `${headAddress}...${tailAddress}`
}

export const parseBalance = (balance:string) => {
  return new BigNumber(balance).dividedBy(new BigNumber(10).pow(DECIMAL)).toString();
}

export const getBalanceETH = async (address:string) => {
  try {
    return await web3.eth.getBalance(address);
  } catch (err) {
    throw err
  }
}

export const getEvent = async (eventType: string) => {
  try {
    const latest = await web3.eth.getBlockNumber();
    const options = {
      fromBlock: latest - 100,
      toBlock: latest,
    }
    return await contract.getPastEvents(eventType, options);
  } catch (error) {
    throw error
  }
}

export const getNetWork = async() => {
  try {
    return await web3.eth.net.getNetworkType();
  } catch (error) {
    throw error
  }
}

export const getBalanceWETH = async (address: string) => {
  try {
    return await contract.methods.balanceOf(address).call();
  } catch (error) {
    throw error
  }
}

export const buildBaseTransaction = async (address: string) => {
  const gasLimit = 1000000;
  const gasPrice = 200000000000;
  const nonce = await web3.eth.getTransactionCount(address);

  return {
    nonce: nonce,
    from: address,
    to: CONTRACT_ADDRESS,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
  }
}

export const signDataTransaction = (txData:any) => {
  const transaction = new Tx(txData,{chain: 'rinkeby'});
  transaction.sign(ACCOUNT_PRIVATE_KEY);

  return transaction.serialize().toString('hex')
}

export const buildDepositTransaction = async (address:string, payableAmount:string) => {
  const baseTransaction = await buildBaseTransaction(address);
  const data = contract.methods.deposit().encodeABI();

  return  {
    ...baseTransaction,
    data: data,
    value: web3.utils.toHex(web3.utils.toWei(payableAmount, 'ether'))
  }
}

export const buildWithdrawTransaction = async (address: string, payableAmount:string) => {
  const baseTransaction = await buildBaseTransaction(address);
  const data = contract.methods.withdraw(
    new BigNumber(payableAmount).multipliedBy(new BigNumber(10).pow(DECIMAL))
  ).encodeABI();

  return {
    ...baseTransaction,
    data: data
  }
}

export const depositViaSmartContract = async (address:string, payableAmount:string) => {
  try {
    const txData = await buildDepositTransaction(address, payableAmount);
    const serializedTx = signDataTransaction(txData);
    const sendTransaction = await web3.eth.sendSignedTransaction('0x'+ serializedTx);

    return sendTransaction.transactionHash;
  } catch (error) {
    throw error
  }
}

export const withdrawViaSmartContract = async (address:string, payableAmount:string) => {
  try {
    const txData = await buildWithdrawTransaction(address, payableAmount);
    const serializedTx = signDataTransaction(txData);
    const sendTransaction = await web3.eth.sendSignedTransaction('0x'+ serializedTx);

    return sendTransaction.transactionHash;
  } catch (error) {
    throw error
  }
}
