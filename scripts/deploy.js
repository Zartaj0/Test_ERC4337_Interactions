

async function main() {
  const factory = await ethers.deployContract("SwapExamples",["0xE592427A0AEce92De3Edee1F18E0157C05861564"]);
  console.log(`Lock deployed to ${factory}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
