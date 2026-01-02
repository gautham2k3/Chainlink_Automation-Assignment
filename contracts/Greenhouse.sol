// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract Greenhouse is AutomationCompatibleInterface {
    
    uint256 public lastWateredTime;
    uint256 public moistureThreshold=30;
    uint256 public dryingRate=1;         
    event PlantWatered(uint256 timestamp, uint256 newMoisture);

    constructor() {
        lastWateredTime = block.timestamp;
    }

    function getMoistureLevel() public view returns (uint256) {
        uint256 timeElapsed=block.timestamp-lastWateredTime;
        uint256 moistureLoss=timeElapsed*dryingRate;
        if (moistureLoss>=100) {
            return 0; 
        }
        return 100-moistureLoss;
    }

    function checkUpkeep(bytes calldata) external view override 
        returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = getMoistureLevel() < moistureThreshold;
        return (upkeepNeeded,"");
    }

    function performUpkeep(bytes calldata) external override {
        if (getMoistureLevel()<moistureThreshold) {
            lastWateredTime=block.timestamp;
            emit PlantWatered(block.timestamp,100);
        }
    }
}