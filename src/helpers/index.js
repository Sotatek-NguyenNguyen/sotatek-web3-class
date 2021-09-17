const ethereumGlobal = () => {
  const { ethereum } = window;
  if (typeof ethereum === "undefined") {
    console.log("ethereum undefined");
    return false;
  } else {
    return ethereum;
  }
};

const networkName = (netId) => {
  switch (netId) {
    case 1:
      return "Mainnet";
    case 3:
      return "Ropsten";
    case 4:
      return "Rinkeby";
    case 5:
      return "Goerli";
    case 42:
      return "Kovan";
    default:
      break;
  }
};

const reloadPageTimeout = (time = 1500) => {
  setTimeout(() => {
    window.location.reload();
  }, time);
};

export { networkName, reloadPageTimeout, ethereumGlobal };
