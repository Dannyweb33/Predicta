// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../contracts/MockUSDC.sol";
import {ArcSignalMarket} from "../contracts/ArcSignalMarket.sol";

contract DeployScript is Script {
    function run() external {
        // Ler PRIVATE_KEY como string e converter para uint256
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey;
        
        // Se não começar com 0x, adicionar o prefixo
        bytes memory keyBytes = bytes(privateKeyStr);
        if (keyBytes.length > 0 && keyBytes[0] != '0' && keyBytes[1] != 'x') {
            string memory prefixedKey = string.concat("0x", privateKeyStr);
            deployerPrivateKey = uint256(vm.parseUint(prefixedKey));
        } else {
            deployerPrivateKey = uint256(vm.parseUint(privateKeyStr));
        }
        
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
