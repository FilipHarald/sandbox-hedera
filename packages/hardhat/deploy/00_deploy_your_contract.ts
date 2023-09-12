import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🥼 ===================");
  const [signer] = await hre.ethers.getSigners();
  const balance = await signer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance));
  console.log("Account address:", signer.address);
  const tx = {
    to: "0x05FbA803Be258049A27B820088bab1cAD2058871",
    value: hre.ethers.utils.parseEther("2"),
  };
  const transaction = await signer.sendTransaction(tx);
  await transaction.wait(1);
  const balance2 = await signer.getBalance();
  console.log("Account balance after:", hre.ethers.utils.formatEther(balance2));

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
    gasLimit: 8000000,
  });

  console.log(deployer);

  // Get the deployed contract
  const yourContract = await hre.ethers.getContract("YourContract", deployer);
  await yourContract.deployed();
  yourContract.connect(deployer);
  const res = await yourContract.setGreeting("Hello, Hedera!");
  await res.wait(1);
  const greeting = await yourContract.greeting();
  console.log(`YourContract is deployed at ${yourContract.address} and says: ${greeting}`);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
