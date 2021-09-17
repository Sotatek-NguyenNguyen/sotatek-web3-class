const { URL } = require('./constants');
const Web3 = require('web3');

const getWeb3Instance = () => {
  return new Web3(Web3.givenProvider || URL);
};

module.exports.convertWeiToEth = (amount) => {
  const web3 = getWeb3Instance();
  return web3.utils.fromWei(amount, 'ether');
};
