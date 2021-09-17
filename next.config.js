/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    ENDPOINT_HTTPS: 'https://rinkeby.infura.io/v3',
    ENDPOINT_SOCKET: 'wss://rinkeby.infura.io/ws/v3',
    PROJECT_SECRET_KEY: 'a5f057b056e5496d96abfdac18bba6e2',
    CONTRACT_ADDRESS: '0xc778417e063141139fce010982780140aa0cd5ab',
    ACCOUNT_PRIVATE_KEY: '98a0683fa174ad50f6c06c3806067253e1e4d0c51bb712c25e0440a5611cccb4',
  }
}
