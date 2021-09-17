import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export const Header = (props) => {
  const { account } = props;
  const handleConnectWallet = async() => {
    await props.connectWallet();
  };

  return (
    <div className="header">
      <div className="wrapper">
        <div className="container">
          <div className="header-top">
            <Link to="/" className="text-logo">
              Web3 FE
            </Link>
            <button
              className="connect-wallet text-center truncate"
              onClick={() => handleConnectWallet()}
            >
              {account ? `Connected to ${account}` : "Connect wallet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
