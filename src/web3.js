import React from 'react'
import Web3 from 'web3'
import contrcABI from './contrcABI.json'
import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = await accounts[0];

        localStorage.setItem('account', account);

        return account
    } catch (error) {
        console.log(error)
    }
};

export const connectWithWalleConnect = async () => {
    try {
        const provider = new WalletConnectProvider({
            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
        });

        const connect = await provider.enable();

        return connect
    } catch (error) {
        console.log(error)
    }
};
export const getNativeTokenBalance = async (walletAddr) => {
    try {
        const web3 = new Web3(Web3.givenProvider);

        const balance = await web3.eth.getBalance(walletAddr);

        const balanceFromWei = Web3.utils.fromWei(String(balance))
        return balanceFromWei
    }
    catch (err) {
        console.log(err)
    }
}

// export const getMlticallBalance = async (listAddr, calls) => {
//     try {
//         const multi = getMulticallContract()
//         const itf = new ethers.utils.Interface(abi)

//         const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
//         const { returnData } = await multi.aggregate(calldata)

//         const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

//         return res
//     } catch (error) {
//         throw new Error(error)
//     }
// }

export const getChainId = async (walletAddr) => {
    try {
        const web3 = new Web3(Web3.givenProvider);
        const chainId = web3.eth.getChainId().then((result) => {
            return result
        })

        return chainId
    }
    catch (err) {
        console.log(err)
    }
}

export const getTokenBalance = async (walletAddr) => {
    try {
        const tokenAddr = '0xc778417e063141139fce010982780140aa0cd5ab';
        const web3 = new Web3(Web3.givenProvider);
        const contr = await new web3.eth.Contract(contrcABI, tokenAddr)
        const balance = await contr.methods
            .balanceOf(walletAddr)
            .call()

        const balanceFromWei = Web3.utils.fromWei(String(balance))
        return balanceFromWei
    }
    catch (err) {
        console.log(err)
    }
}

export const queryTransfer = async (walletAddr) => {
    try {
        const tokenAddr = '0xc778417e063141139fce010982780140aa0cd5ab';
        const web3 = new Web3(Web3.givenProvider);
        const contr = await new web3.eth.Contract(contrcABI, tokenAddr)

        let latestBlock = await web3.eth.getBlockNumber();
        let past100block = latestBlock - 100;

        const tranf = await contr.getPastEvents(
            'Transfer',
            { fromBlock: past100block, toBlock: 'latest' }
        );
        return tranf
    }
    catch (err) {
        console.log(err)
    }
}

export const listenTransfer = async (walletAddr) => {
    try {
        const tokenAddr = '0xc778417e063141139fce010982780140aa0cd5ab';
        const web3 = new Web3(Web3.givenProvider);
        const contr = await new web3.eth.Contract(contrcABI, tokenAddr)

        const subscription = await contr.events.Transfer((error, event) => {
            console.log(event);
        })

        return subscription
    }
    catch (err) {
        console.log(err)
    }
}

export const deposit = async (walletAddr, amount) => {
    try {
        const tokenAddr = '0xc778417e063141139fce010982780140aa0cd5ab';
        const web3 = new Web3(Web3.givenProvider);
        const contr = await new web3.eth.Contract(contrcABI, tokenAddr)
        const dps = await contr.methods
            .deposit()
            .send({
                from: walletAddr,
                gas: 300000,
                value: Web3.utils.toWei(String(amount))
            })
        return dps
    }
    catch (err) {
        console.log(err)
    }
}
export const withdraw = async (walletAddr, amount) => {
    try {
        const tokenAddr = '0xc778417e063141139fce010982780140aa0cd5ab';
        const web3 = new Web3(Web3.givenProvider);
        const contr = await new web3.eth.Contract(contrcABI, tokenAddr)
        const wd = await contr.methods
            .withdraw(Web3.utils.toWei(String(amount)))
            .send({
                from: walletAddr,
                gas: 300000,
            })
        return wd
    }
    catch (err) {
        console.log(err)
    }
}