import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const CONTRACT_NAME = "Balloons";

const deployBalloonToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy(CONTRACT_NAME, {
    from: deployer,
    args: [],
    log: true,
    // gasLimit: 8000000,
  });
};

export default deployBalloonToken;

deployBalloonToken.tags = [CONTRACT_NAME];
