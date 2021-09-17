import Web3 from 'web3';
import BigNumber from 'bignumber.js';

const WethAbi = require('src/abi/weth-abi.json');

const addressWeth = process.env.REACT_APP_WETH_ADDRESS;
const accountAddress = process.env.REACT_APP_ACCOUNT_ADDRESS;

export const getWeb3Instance = async () => {
  const windowObj = window as any;
  if (windowObj.ethereum) {
    const web3 = new Web3(windowObj.ethereum);
    await windowObj.ethereum.enable();
    return web3;
  } else if (windowObj.web3) {
    const web3 = new Web3(windowObj.web3.currentProvider);
    return web3;
  } else {
    const provider = new Web3.providers.HttpProvider(
      `https://rinkeby.infura.io/v3/305b5e9b47f34f1696974d3b695bee74`,
    );
    // const provider = new Web3.providers.HttpProvider(`https://localhost:8545`);
    const web3 = new Web3(provider);
    return web3;
  }
};

export const getBalanceOfEth = async (account: string) => {
  try {
    const web3 = await getWeb3Instance();
    const balance = await web3.eth.getBalance(account);
    console.log(balance);
    return balance;
  } catch (err) {
    console.log(err);
  }
};

export const getBalanceOfWeth = async (account: string) => {
  try {
    const web3 = new Web3(Web3.givenProvider);
    const contract = await new web3.eth.Contract(WethAbi, addressWeth);
    const balanceOfWeth = contract.methods.balanceOf(account).call();
    return balanceOfWeth;
  } catch (err) {
    console.log(err);
  }
};

export const convertWeiToEth = (amount: string) => {
  const web3 = new Web3(Web3.givenProvider);
  return web3.utils.fromWei(amount, 'ether');
};

export const convertEthToWei = (amount: string) => {
  const web3 = new Web3(Web3.givenProvider);
  return web3.utils.toWei(new BigNumber(amount).toFixed(), 'ether');
};

export const deposit = async (amount: string) => {
  try {
    if (Number(amount) > 0) {
      const web3 = new Web3(Web3.givenProvider);

      const contract = await new web3.eth.Contract(WethAbi, addressWeth);
      const amountConvert = convertEthToWei(amount);

      await contract.methods.deposit().send({
        from: accountAddress,
        value: amountConvert,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const withdraw = async (amount: string) => {
  try {
    if (Number(amount) > 0) {
      const web3 = new Web3(Web3.givenProvider);

      const contract = await new web3.eth.Contract(WethAbi, addressWeth);
      const amountConvert = convertEthToWei(amount);

      await contract.methods.withdraw(amountConvert).send({
        from: accountAddress,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
