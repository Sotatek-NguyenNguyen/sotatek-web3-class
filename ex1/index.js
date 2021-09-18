const Web3 = require('web3');
const fs = require('fs');
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config()
const abi = JSON.parse(fs.readFileSync('abi.json').toString());
const contractAddress = "0xc778417e063141139fce010982780140aa0cd5ab";

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC
  },
  providerOrUrl: process.env.PROVIDER_URL
});
const addresses = [
  "0xd8c19fb591ab19081f858b5c892063dffb171897",
  "0xd7c352100c11a796d83cc9c6e0bd0a8926f1a029",
  "0xc7fdb8e887168dcd0c07c88fc8f1491a94528cb1",
  "0x971ca37088734adeb6580db5a61d753597e2346f",
  "0x257b15a22ab4056cd3955ff5b058ee32125b9b64",
  "0x940741e3157a6edac5067e98e35b549a8cf902c9",
  "0x6f1f01dd53c84ac6ca82bd3f30be7e536b9e40f4",
  "0xdc451f294513ee7547a5f751c06d086ba9bdb56f",
  "0x44355e44bfd621d533c10a995f88fcf85c7e426d",
  "0x159a0ad72bf78b31b04c9252276d8227144cefab",
  "0x006ce6b9ae4183b58503fd50e0f3e610b0979c94",
]

async function start() {
  // 1. Initiate a web3 instance
  const web3 = new Web3(provider);

  // 2. Create a contract with address of WETH: 0xc778417e063141139fce010982780140aa0cd5ab (rinkeby)
  const contract = new web3.eth.Contract(abi, contractAddress);

  // 3. Query the balance of any wallet address 
  await contract.methods.balanceOf(addresses[0]).call();

  // 4. Create a function to query event “transfer” on the last 100 block 
  const latestBlockNumber = await web3.eth.getBlockNumber();
  await contract.getPastEvents("Transfer", {
    fromBlock: latestBlockNumber - 100,
    toBlock: 'latest'
  })

  // 5. Create a function to listen to event “transfer” 
  contract.events.allEvents("Transfer", {})
    .on('data', function (event) {
      // Process event
    })

  // 6. Using multicall function to get the balance of 10 wallet addresses 
  // Example multicall: https://github.com/pancakeswap/pancake-frontend/blob/develop/src/utils/multicall.ts 
  const { Multicall } = require('ethereum-multicall');
  const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

  const contractCallContext = addresses.map(address => (
    {
      reference: address,
      contractAddress: contractAddress,
      abi: abi,
      calls: [{ methodName: 'balanceOf', methodParameters: [addresses[0]] }]
    }
  ));
  const results = await multicall.call(contractCallContext);
  const formattedResults = {};
  for (const [key, value] of Object.entries(results.results)) {
    formattedResults[key] = parseInt(value.callsReturnContext[0].returnValues[0].hex.substr(2), 16);
  }
  console.log(formattedResults);
}

start();