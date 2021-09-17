import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Web3ReactProviderWrapper } from 'src/components';

ReactDOM.render(
  <Web3ReactProviderWrapper>
    <App />
  </Web3ReactProviderWrapper>,
  document.getElementById('root'),
);
