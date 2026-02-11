// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../contracts/MockUSDC.sol";
import {ArcSignalMarket} from "../contracts/ArcSignalMarket.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying MockUSDC...");
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed at:", address(usdc));

        console.log("Deploying ArcSignalMarket...");
        ArcSignalMarket market = new ArcSignalMarket(address(usdc));
        console.log("ArcSignalMarket deployed at:", address(market));

        vm.stopBroadcast();
    }
}
