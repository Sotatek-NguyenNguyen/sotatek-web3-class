const { URL, WETH_ADDRESS, SENDER_ADDRESS } = require('./constants');
const { convertWeiToEth } = require('./helpers');
const wethAbi = require('./abi/weth-abi.json');

const Web3 = require('web3');
const web3Instance = new Web3(Web3.givenProvider || URL);

const contract = new web3Instance.eth.Contract(wethAbi, WETH_ADDRESS);

const getBalanceOf = async (accountAdress) => {
  const balanceOf = await contract.methods.balanceOf(accountAdress).call();
  const symbol = await contract.methods.symbol().call();
  console.log(`Balance of ${symbol}: ${convertWeiToEth(balanceOf)}`);
};
getBalanceOf(SENDER_ADDRESS);

const queryTransfer = async () => {
  const lastestBlock = await web3Instance.eth.getBlockNumber();
  const eventTransfer = await contract.getPastEvents('Transfer', {
    fromBlock: lastestBlock - 100,
    toBlock: 'latest',
  });
  console.log(eventTransfer);
};
// queryTransfer();

const listenTransfer = async () => {
  const lastestBlock = await web3Instance.eth.getBlockNumber();
  const options = {
    fromBlock: lastestBlock - 100,
  };
  contract.events
    .Transfer(options, function (error, event) {
      console.log(event);
    })
    .on('data', (event) => console.log('event: ', event))
    .on('changed', (changed) => console.log('changed: ', changed))
    .on('error', (err) => console.log('error: ', err.message));
};
listenTransfer();
