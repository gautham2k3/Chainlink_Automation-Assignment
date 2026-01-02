const { web3, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];

  console.log("Deploying Greenhouse with account:", deployer);

  const Greenhouse = await artifacts.readArtifact("Greenhouse");
  const Contract = new web3.eth.Contract(Greenhouse.abi);

  const deployedContract = await Contract.deploy({
    data: Greenhouse.bytecode,
    arguments: [], 
  }).send({
    from: deployer,
    gas: 1000000,
  });

  console.log("Greenhouse deployed to:", deployedContract.options.address);

  saveFrontendFiles(Greenhouse, deployedContract.options.address);
}

function saveFrontendFiles(artifact, address) {
  const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir,{recursive:true});
  }
  fs.writeFileSync(
    path.join(contractsDir,"contract-address.json"),
    JSON.stringify({ Greenhouse: address },undefined,2)
  );
  fs.writeFileSync(
    path.join(contractsDir,"Greenhouse.json"),
    JSON.stringify(artifact,undefined,2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });