import React, { useEffect, useState } from "react";
import { Header } from "../header/header";
import { Footer } from "../footer/index";
import { networkName, ethereumGlobal } from "../../helpers";
import "./index.scss";

import { CONTRACT_ADDRESS, ABI_ARRAY } from "../../contracts/contract";

import Web3 from "web3";
let web3;
let myContract;

export const Home = (props) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [weth, setWETHBalance] = useState(0);
  const [network, setNetwork] = useState("");
  const [messageErr, setMessageErr] = useState(null);
  const [requestMetamaskErr, setRequestMetamaskErr] = useState({});
  const [despositAmount, setDespositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [actionMessage, setActionMessage] = useState(null);
  const [depositStatus, setDepositStatus] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [queryTransferStatus, setQueryTransferStatus] = useState(null);
  const [listenTransfer, setlistenTransfer] = useState(null);
  const [queryTransferData, setQueryTransferData] = useState(null);
  const [addressBalanace, setAddressBalanace] = useState("");
  const [balanceOfAddress, setBalanceOfAddress] = useState(null);

  const { ethereum } = window;

  const handleConnectWallet = () => {
    if (!account) {
      loadWeb3();
    }
  };

  const loadWeb3 = () => {
    try {
      if (typeof ethereum === "undefined") {
        const msg = (
          <p>
            Not connected to a Web3 Wallet. <br /> Please install and enable
            MetaMask.
          </p>
        );
        setMessageErr(msg);
      } else {
        web3 = new Web3(ethereum);

        ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts) => {
            if (accounts.length) {
              // reset state to default
              setMessageErr(null);
              setRequestMetamaskErr({});
              // set data
              setAccount(accounts[0]);
              getETHBalance(accounts[0]);
              getNetwork();
            }
          })
          .catch((err) => {
            const errorMsg = JSON.stringify(err);
            setRequestMetamaskErr(JSON.parse(errorMsg));
          });
      }
    } catch (error) {
      if (error) {
        const err = JSON.stringify(error);
        setMessageErr(
          `${JSON.parse(err).message} Or reload page and connection again.`
        );
      }
    }
  };

  const loadExistAccountConnected = async () => {
    if (ethereumGlobal()) {
      web3 = new Web3(ethereumGlobal());

      ethereumGlobal()
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          if (accounts.length) {
            // reset state to default
            setMessageErr(null);
            setRequestMetamaskErr({});
            // set data
            setAccount(accounts[0]);
            getETHBalance(accounts[0]);
            getNetwork();

            myContract = new web3.eth.Contract(ABI_ARRAY, CONTRACT_ADDRESS);
            getWETHBalance(accounts[0]);
          }
        })
        .catch((err) => {
          const errorMsg = JSON.stringify(err);
          setRequestMetamaskErr(JSON.parse(errorMsg));
        });
    }
  };

  const getETHBalance = (address) => {
    web3.eth.getBalance(address, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const balance = web3.utils.fromWei(result, "ether");
        setBalance(balance);
      }
    });
  };

  const getWETHBalance = async (address) => {
    const balanceOf = await myContract.methods.balanceOf(address).call();
    const balance = web3.utils.fromWei(balanceOf + "", "ether");
    setWETHBalance(balance);
  };

  const getNetwork = () => {
    web3.eth.net
      .getId()
      .then((netId) => {
        setNetwork(networkName(netId));
      })
      .catch((err) => {
        console.log("getNetwork", err);
      });
  };

  const accountsChanged = () => {
    if (ethereum) {
      web3 = new Web3(ethereum);

      ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length) {
          setAccount(accounts[0]);
          getETHBalance(accounts[0]);
          getNetwork();
        } else {
          setAccount(null);
        }
      });
    }
  };
  const chainChanged = () => {
    if (ethereum && account) {
      web3 = new Web3(ethereum);

      ethereum.on("chainChanged", (chainId) => {
        getETHBalance(account);
        getNetwork();
      });
    }
  };

  const handleDepositAmountChange = (e) => {
    setDespositAmount(e.target.value);
  };

  const handleWithdrawAmountChange = (e) => {
    setWithdrawAmount(e.target.value);
  };

  const handleDeposit = () => {
    const amount = web3.utils.toWei(despositAmount + "", "ether");
    console.log(account);

    myContract.methods
      .deposit()
      .send({
        from: account,
        value: amount,
      })
      .on("sent", function (send) {
        setDepositStatus("Desposit processing, Please wait... ");
      })
      .on("receipt", function (receipt) {
        setDepositStatus("Deposit Complete");
      })
      .on("error", function (error) {
        setMessageErr(error.message);
      });
  };

  const handleWithdraw = () => {
    const amount = web3.utils.toWei(withdrawAmount + "", "ether");

    myContract.methods
      .withdraw(amount)
      .send({
        from: account,
      })
      .on("sent", function (send) {
        setWithdrawStatus("Withdraw processing, Please wait... ");
      })
      .on("receipt", function (receipt) {
        const txnh = receipt && receipt.transactionHash;
        setWithdrawStatus(`Withdraw Complete, Transaction Hash: ${txnh}`);
      })
      .on("error", function (error) {
        setMessageErr(error.message);
      });
  };

  const handleQueryTransfer = async () => {
    setQueryTransferStatus("Querying...");
    setQueryTransferData(null);
    const lastestBlock = await web3.eth.getBlockNumber();
    const transfer = await myContract.getPastEvents("Transfer", {
      fromBlock: lastestBlock - 100,
      toBlock: "latest",
    });

    if (transfer) {
      setQueryTransferData(JSON.stringify(transfer));
      setQueryTransferStatus(null);
    }
  };

  const handleListenTransfer = async () => {
    setlistenTransfer("Open console.log for view listen transfer.")
    const lastestBlock = await web3.eth.getBlockNumber();

    myContract.events
      .Transfer({ fromBlock: lastestBlock - 100 }, function (error, event) {
        console.log(event);
      })
      .on("data", (event) => console.log("event: ", event))
      .on("changed", (changed) => console.log("changed: ", changed))
      .on("error", (err) => console.log("error: ", err.message));
  };

  const handleInputAddressBalance = (e) => {
    setAddressBalanace(e.target.value);
  };

  const handleGetBalance = async () => {
    try {
      const balanceOf = await myContract.methods
        .balanceOf(addressBalanace)
        .call();
      const balance = web3.utils.fromWei(balanceOf + "", "ether");
      setBalanceOfAddress(balance);
      console.log(balance);
    } catch (err) {
      setBalanceOfAddress(null);
      console.log(err);
    }
  };

  useEffect(() => {
    loadExistAccountConnected();
    accountsChanged();
    chainChanged();
  }, [account]);

  return (
    <>
      <Header connectWallet={() => handleConnectWallet()} account={account} />
      <div className="home-page bg-dark">
        <div className="content">
          <div className="container">
            <div className="wrap-content">
              <img src="images/metamask-fox.png" alt="metamask" />
              {!ethereumGlobal() ? (
                <div className="err-message text-center text-orange">
                  Not connected to a Web3 Wallet. <br /> Please install and
                  enable MetaMask.
                </div>
              ) : (
                <>
                  {!account && (
                    <div className="err-message text-center text-orange">
                      Please connect wallet to use.
                    </div>
                  )}
                  {messageErr && (
                    <div className="err-message text-center text-orange">
                      {messageErr}
                    </div>
                  )}
                  {requestMetamaskErr.message && (
                    <div className="err-message text-center text-orange">
                      {requestMetamaskErr.message}
                    </div>
                  )}

                  {ethereum && account ? (
                    <>
                      <div className="account-info">
                        <p>
                          <span className="label">-ETH Balance:</span>
                          {balance} ETH
                        </p>
                        <p>
                          <span className="label">-WETH Balance:</span>
                          {weth} ETH
                        </p>
                        <p>
                          <span className="label">-Network:</span>
                          {network}
                        </p>
                      </div>
                      <button onClick={() => handleGetBalance()}>
                        Get Balance
                      </button>
                      <button onClick={() => handleQueryTransfer()}>
                        {queryTransferStatus
                          ? queryTransferStatus
                          : "Query Transfer"}
                      </button>
                      <button onClick={() => handleListenTransfer()}>
                        Listen Transfer
                      </button>
                      <button onClick={() => handleDeposit()}>
                        Deposit ETH
                      </button>
                      <button onClick={() => handleWithdraw()}>
                        Withdraw ETH
                      </button>

                      <div className="deposit action">
                        <span className="label">Desposit Amount: </span>
                        <input
                          type="number"
                          step="0.01"
                          value={despositAmount}
                          onChange={(e) => handleDepositAmountChange(e)}
                        ></input>
                      </div>
                      <div className="withdraw action">
                        <span className="label">Withdraw Amount: </span>
                        <input
                          type="number"
                          step="0.01"
                          value={withdrawAmount}
                          onChange={(e) => handleWithdrawAmountChange(e)}
                        ></input>
                      </div>

                      <div className="get-balance action">
                        <span className="label">Get Balance: </span>
                        <input
                          style={{ width: "335px" }}
                          type="text"
                          placeholder="input address"
                          value={addressBalanace}
                          onChange={(e) => handleInputAddressBalance(e)}
                        ></input>
                        <span>
                          {" "}
                          {balanceOfAddress ? balanceOfAddress : ""}{" "}
                        </span>
                      </div>

                      <div className="query-data">
                        {queryTransferData ? queryTransferData : ""}
                      </div>
                      {actionMessage && (
                        <div className="err-message text-center text-orange">
                          {actionMessage}
                        </div>
                      )}
                      {depositStatus && (
                        <div className="info-message">{depositStatus}</div>
                      )}
                      {withdrawStatus && (
                        <div className="info-message">{withdrawStatus}</div>
                      )}
                      {listenTransfer && (
                        <div className="info-message">{listenTransfer}</div>
                      )}
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
