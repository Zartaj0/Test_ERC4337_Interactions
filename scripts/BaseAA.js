const { ethers } = require("ethers");
const { Presets, Client } = require("userop");

// rpcUrl = https://goerli.base.org	
const rpcUrl = "https://public.stackup.sh/api/v1/node/ethereum-goerli";
// const paymasterUrl =
//   "https://api.stackup.sh/v1/paymaster/27329782ead57a4a9422d47ba10767e5184dbc5d253970fcd797e5376988f12b";
// const paymasterUrl =
//   "";

const paymasterUrl = "https://paymaster.base.org";

function correctHexString(payloadValue) {
  if (payloadValue.indexOf("0x0") > -1 && payloadValue.length > 3) {
    payloadValue = payloadValue.replace("0x0", "0x");
  }
  return payloadValue;
}

async function payMiddleware(params1) {
  console.log("context", params1);
  // send paymaster request
  const body = {
    id: 1,
    jsonrpc: "2.0",
    method: "eth_paymasterAndDataForUserOperation",
    params: [
      {
        ...params1,
        nonce: correctHexString(
          ethers.BigNumber.from(params1.nonce).toHexString()
        ),
        sender: uoStruct.sender,
        callGasLimit: correctHexString(
          ethers.BigNumber.from(params1.callGasLimit).toHexString()
        ),
        preVerificationGas: correctHexString(
          ethers.BigNumber.from(params1.preVerificationGas).toHexString()
        ),
        verificationGasLimit: correctHexString(
          ethers.BigNumber.from(params1.verificationGasLimit).toHexString()
        ),
        maxFeePerGas: correctHexString(
          ethers.BigNumber.from(params1.maxFeePerGas).toHexString()
        ),
        maxPriorityFeePerGas: correctHexString(
          ethers.BigNumber.from(params1.maxPriorityFeePerGas).toHexString()
        ),
      },
      "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", //stackup entry point
      correctHexString(ethers.BigNumber.from(5).toHexString()),
    ],
  };
  console.log("paymaster body", body);

  const response = await fetch(paymasterUrl, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  // attach paymaster signature

  ctx.op.paymasterAndData = data.result;
}

async function main() {
  const paymasterContext = { type: "payg" };
  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    paymasterContext
  );
  // const opts =
  //   paymasterUrl === ""
      // ? {}
  //     : {
  //         paymasterMiddleware: paymasterMiddleware,
  //       };

  // Initialize the account
  const signingKey =
    "0x4337433743374337433743374337433743374337433743374337433743374337";
  const signer = new ethers.Wallet(signingKey);
  var builder = await Presets.Builder.SimpleAccount.init(signer, rpcUrl); //, opts);
  builder = builder.useMiddleware(payMiddleware);
  const address = builder.getSender();
  console.log(`Account address: ${address}`);
  // Create the call data
  const to = address; // Receiving address, in this case we will send it to ourselves
  const token0 = "0x7a72403B54e166Dc8b5494dB49D832d160b70761"; // Address of the ERC-20 token
  const token1 = "0x0716A45a3F61139C0e3E646511307dbf137C7C7f"; // Address of the ERC-20 token
  const value = "10"; // Amount of the ERC-20 token to transfer
  const value2 = "50"; // Amount of the ERC-20 token to transfer
  const Router = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  // Read the ERC-20 token contract
  const ERC20_ABI = require("./erc20Abi.json"); // ERC-20 ABI in json format
  const Swap_ABI = require("./Swap.json"); // ERC-20 ABI in json format
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const erc20 = new ethers.Contract(token0, ERC20_ABI, provider);
  const RouterInterface = new ethers.Contract(Router, Swap_ABI, provider);
  // const Swap = new ethers.Contract(token, Swap_ABI, provider);
  const decimals = await Promise.all([erc20.decimals()]);
  const amount = ethers.utils.parseUnits(value, decimals);
  const amount2 = ethers.utils.parseUnits(value2, decimals);

  // Encode the calls
  // const callTo = [token, token];
  // const callData = [
  //   erc20.interface.encodeFunctionData("approve", [to, amount]),
  //   erc20.interface.encodeFunctionData("transfer", [to, amount]),
  // ];
  console.log(await erc20.balanceOf(address));
  const callTo = [token1, Router];
  const callData = [
    erc20.interface.encodeFunctionData("approve", [Router, amount]),
    RouterInterface.interface.encodeFunctionData("exactInputSingle", [
      {
        tokenIn: token1,
        tokenOut: token0,
        fee: 500,
        recipient: address,
        deadline: 1801670579,
        amountIn: amount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      },
    ]),
  ];

  // Send the User Operation to the ERC-4337 mempool
  console.log("Sending User Operation");
  const client = await Client.init(rpcUrl);
  const res = await client.sendUserOperation(
    builder.executeBatch(callTo, callData),
    {
      onBuild: async (op) => {
        console.log("Signed UserOperation:", op);
      },
    }
  );

  // Return receipt
  console.log(`UserOpHash: ${res.userOpHash}`);
  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
  console.log(`View here: https://jiffyscan.xyz/userOpHash/${res.userOpHash}`);
}

main().catch((err) => console.error("Error:", err));
