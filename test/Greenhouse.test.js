const { assert } = require("chai");
const { web3, network, artifacts } = require("hardhat");

describe("Greenhouse Keeper Simulation", function () {
  let greenhouseContract;
  let accounts;
  
  const MOISTURE_THRESHOLD = 30;
  const DRYING_RATE = 1;

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts();

    const Greenhouse = await artifacts.readArtifact("Greenhouse");
    const Contract = new web3.eth.Contract(Greenhouse.abi);
    
    greenhouseContract = await Contract.deploy({
      data: Greenhouse.bytecode,
      arguments: [],
    }).send({
      from: accounts[0],
      gas: 1000000,
    });
  });

  it("1. Plant should start healthy (100% moisture)", async function () {
    const moisture = await greenhouseContract.methods.getMoistureLevel().call();
    assert.equal(moisture, "100", "Plant should start at 100%");
  });

  it("2. checkUpkeep should return FALSE when plant is healthy", async function () {
    const result = await greenhouseContract.methods.checkUpkeep("0x").call();
    const upkeepNeeded = result.upkeepNeeded || result[0];
    
    assert.isFalse(upkeepNeeded, "Upkeep should NOT be needed yet");
  });

  it("3. checkUpkeep should return TRUE after drying out", async function () {
    const secondsToWait = 75;

    await network.provider.send("evm_increaseTime", [secondsToWait]);
    await network.provider.send("evm_mine");

    // Check Moisture
    const moisture = await greenhouseContract.methods.getMoistureLevel().call();
    console.log(`\tMoisture dropped to ${moisture}%`);
    assert.isBelow(Number(moisture), MOISTURE_THRESHOLD, "Moisture should be below 30%");

    const result = await greenhouseContract.methods.checkUpkeep("0x").call();
    const upkeepNeeded = result.upkeepNeeded || result[0];
    assert.isTrue(upkeepNeeded, "Upkeep SHOULD be needed now");
  });

  it("4. performUpkeep should water the plant back to 100%", async function () {
    await network.provider.send("evm_increaseTime", [75]);
    await network.provider.send("evm_mine");

    await greenhouseContract.methods.performUpkeep("0x").send({ from: accounts[0] });

    const moisture = await greenhouseContract.methods.getMoistureLevel().call();
    assert.equal(moisture, "100", "Plant should be watered back to 100%");
  });
});