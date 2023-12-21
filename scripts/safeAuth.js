require("dotenv").config();
const {
  SafeAuthPack,
  SafeAuthConfig,
  SafeAuthInitOptions,
} = require("@safe-global/auth-kit");

async function main() {
  const safeAuthInitOptions = {
    enableLogging: true,
    showWidgetButton: false,
    chainConfig: {
      chainId: "0x1",
      rpcTarget: `${process.env.goerli}`,
    },
  };

  // You can also pass the SafeAuthConfig as a parameter to the SafeAuthPack constructor if you are using a custom txServiceUrl domain
  // e.g.
  const safeAuthConfig = {
    txServiceUrl: "https://safe-transaction-mainnet.safe.global",
  };
  const safeAuthPack = new SafeAuthPack(safeAuthConfig);

  (async () => {
    await safeAuthPack.init(safeAuthInitOptions);
  })();

  const authKitSignData = await safeAuthPack.signIn();

  const provider = safeAuthPack.getProvider();
  console.log(provider);
}

main();
