const rpcUrl = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161	";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const { createPublicClient, http } = require("viem"); // Replace 'some-library' with the actual library you are using
const {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} = require("permissionless/clients/pimlico");
const { getContract } = require("viem");
const {
  createBundlerClient,
  createSmartAccountClient,
} = require("permissionless");
const {
  privateKeyToSafeSmartAccount,
  signerToSafeSmartAccount,
} = require("permissionless/accounts");

async function main() {
  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  const paymasterClient = createPimlicoPaymasterClient({
    transport: http(
      "https://api.pimlico.io/v2/goerli/rpc?apikey=f9dae1b5-1aea-471d-a6c1-18c0f20398b0"
    ),
  });

  // You may need to replace 'some-library' with the actual library you are using for createPublicClient, createPimlicoPaymasterClient, and http.

  // const safeAccount = await privateKeyToSafeSmartAccount(publicClient, {
  //   privateKey: "0x4337433743374337433743374337433743374337433743374337433743374337",
  //   safeVersion: "1.4.1",
  //   entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
  //   saltNonce: 0n, // optional
  //   addModuleLibAddress: "0x191EFDC03615B575922289DC339F4c70aC5C30Af",
  //   safe4337ModuleAddress: "0x39E54Bb2b3Aa444b4B39DEe15De3b7809c36Fc38",
  //   safeProxyFactoryAddress: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
  //   safeSingletonAddress: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
  //   multiSendAddress: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
  //   multiSendCallOnlyAddress: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",
  //   safeModules: ["0x"],
  //   setupTransactions: [
  //     {
  //       to: "0x",
  //       data: "0x",
  //     },
  //   ],
  // });

  // console.log(safeAccount);
  const bundlerClient = createPimlicoBundlerClient({
    transport: http(
      "https://api.pimlico.io/v1/goerli/rpc?apikey=f9dae1b5-1aea-471d-a6c1-18c0f20398b0"
    ),
  });

  const gasPrices = await bundlerClient.getUserOperationGasPrice();

  console.log("creating account client");

  //   const safeAccount = await privateKeyToSafeSmartAccount(publicClient, {
  //     privateKey:
  //       "0x4337433743374337433743374337433743374337433743374337433743374337",
  //     safeVersion: "1.4.1",
  //     entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
  //     saltNonce: 0n, // optional
  //   });
  const privateKey =
    "0x4337433743374337433743374337433743374337433743374337433743374337";
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("creating safe account with", signer);
  console.log("PublicKey", );
  //   const safeAccount = await privateKeyToSafeSmartAccount(publicClient, {
  //     privateKey:
  //       "0x4337433743374337433743374337433743374337433743374337433743374337",
  //     safeVersion: "1.4.1",
  //     entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
  //     saltNonce: 0n, // optional
  //   });

  const customSigner = {
    address: await signer.getAddress(),
    publicKey: "0x..",
    source: "custom",
    type: 'local',
    signMessage: async ({message}) => {
        return "0x.."
    },
    signTypedData: async (typeData) => {
        return signer.signTypedData(typeData.domain, {
            [typeData.primaryType]: typeData[typeData.primaryType]
        }, typeData.message)
    }
  }

  const safeAccount = await signerToSafeSmartAccount(publicClient, {
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    signer: customSigner,
    safeVersion: "1.4.1",
    saltNonce: 0n,
  });

  console.log(safeAccount);
  const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    chain: "goerli",
    transport: http(
      "https://api.pimlico.io/v1/goerli/rpc?apikey=f9dae1b5-1aea-471d-a6c1-18c0f20398b0"
    ),
    sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
  });
  console.log("smartAccountClient created Succesfully");

  const token0 = "0x7a72403B54e166Dc8b5494dB49D832d160b70761"; // Address of the ERC-20 token
  const token1 = "0x0716A45a3F61139C0e3E646511307dbf137C7C7f"; // Address of the ERC-20 token
  const value2 = "20"; // Amount of the ERC-20 token to transfer
  const Router = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  // Read the ERC-20 token contract
  const ERC20_ABI = require("./erc20Abi.json"); // ERC-20 ABI in json format
  const Swap_ABI = require("./Swap.json"); // ERC-20 ABI in json format

  const erc20 = new ethers.Contract(token0, ERC20_ABI, provider);
  const decimals = await Promise.all([erc20.decimals()]);
  const amount2 = ethers.utils.parseUnits(value2, decimals);
  console.log(amount2);

  const tokenCon = getContract({
    address: token1,
    abi: ERC20_ABI,
    publicClient,
    walletClient: smartAccountClient,
    maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
    maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
  });
  console.log("Creating Router");

  const routerCon = getContract({
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    abi: Swap_ABI,
    publicClient,
    walletClient: smartAccountClient,
    maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
    maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
  });
  console.log("Created Router");

  const txHash = await tokenCon.write.approve([Router, amount2]);
  console.log("Tx succesful");

  console.log(txHash);

  const txHash2 = await routerCon.write.exactInputSingle([
    {
      tokenIn: token1,
      tokenOut: token0,
      fee: 500,
      recipient: "0x4337004ec9c1417F1c7a26EBD4B4fbed6ACf9E5d",
      deadline: 1801670579,
      amountIn: amount2,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    },
  ]);
  console.log(txHash2);
}

main();
