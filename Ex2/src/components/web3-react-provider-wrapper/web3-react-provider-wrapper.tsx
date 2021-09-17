import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import Web3 from 'web3';

interface Web3ReactProviderWrapperProps {
  children?: any;
}

const getLibrary = (provider: any) => {
  return new Web3(provider);
};

const Web3ReactProviderWrapper: React.FC<Web3ReactProviderWrapperProps> = ({
  children,
}) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  );
};

export default Web3ReactProviderWrapper;
