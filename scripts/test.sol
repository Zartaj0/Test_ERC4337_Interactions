import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/Lock.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeployComm is Script {
address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;    uint decimals = 10 ** ERC20(DAI).decimals();

    function run() public {
        SwapExamples lock = new SwapExamples(
            0xE592427A0AEce92De3Edee1F18E0157C05861564
        );
        console.log(decimals);

        console.log(address(lock));
        console.log(
            ERC20(DAI).balanceOf(0xD831B3353Be1449d7131e92c8948539b1F18b86A)
        );
        vm.startPrank(0xD831B3353Be1449d7131e92c8948539b1F18b86A);
        ERC20(DAI).approve(address(lock), 100000 * decimals);
        lock.swapExactInputSingle(10000 * decimals);
        vm.stopPrank();
        console.log(43758816193128225182605815 - 10000 * decimals);
        console.log(
            ERC20(DAI).balanceOf(0xD831B3353Be1449d7131e92c8948539b1F18b86A)
        );
    }
}