const nodeUrl = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const { FusionSDK, NetworkEnum } = require("@1inch/fusion-sdk");
const blockchainProvider = new PrivateKeyProviderConnector(
  "0x4337433743374337433743374337433743374337433743374337433743374337",
  new Web3(nodeUrl)
);
const sdk = new FusionSDK({
  url: "https://fusion.1inch.io",
  network: NetworkEnum.POLYGON,
  blockchainProvider,
});

const quoteParams = {
  fromTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WMATIC
  toTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
  amount: "10000000000000000000", // 10 WMATIC
  walletAddress: makerAddress,
  source: "sdk",
  permit: "0x",
  enableEstimate: true,
  fee: {
    takingFeeBps: 0,
    takingFeeReceiver: "0x0000000000000000000000000000000000000000",
  },
};

/* ---- Just do this and it works, but you get no customization ---- */
sdk
  .placeOrder(quoteParams)
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((error) => {
    console.log("Error:", error);
  });
