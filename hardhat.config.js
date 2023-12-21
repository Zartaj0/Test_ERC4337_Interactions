require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-foundry");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { compilers: [{ version: "0.8.20" }, { version: "0.7.6" }] },

  // networks: {
  //   goerli: {
  //     url: `https://public.stackup.sh/api/v1/node/ethereum-goerli`, // <---- YOUR INFURA ID! (or it won't work)
  //     accounts: [process.env.PRIVATE],
  //   },
  // },
};
