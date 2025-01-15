const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  // Deploy MyToken contract
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const MyToken = await ethers.getContractFactory("MyToken");
  // Pass correct arguments for the MyToken constructor
  const myToken = await MyToken.deploy("MyToken", "MTK", 18);
  console.log(`MyToken deployed to: ${myToken.target}`);

  // Deploy TokenSale contract
  const TokenSale = await ethers.getContractFactory("TokenSale");
  const tokenPrice = ethers.parseEther("1"); // in ETH
  const tokenSale = await TokenSale.deploy(myToken.target, tokenPrice);
  console.log(`TokenSale deployed to: ${tokenSale.target}`);

  // Mint initial tokens to the TokenSale contract
  const mintAmount = ethers.parseUnits("1270000000000", 18);
  const tx = await myToken.mint(tokenSale.target, mintAmount);
  await tx.wait();
  console.log(`Seeded 1270000000000 tokens to TokenSale contract: ${tokenSale.target}`);

  // Verify Deployer's Balance
  const balance = await myToken.balanceOf(deployer.address);
  console.log(`Deployer MTK Balance: ${ethers.formatUnits(balance, 18)} MTK`);

  // Write deployment info to .env file
  const envContent = `DEPLOYER_ADDRESS=${deployer.address}
MYTOKEN_ADDRESS=${myToken.target}
TOKENSALE_ADDRESS=${tokenSale.target}
`;

  fs.writeFileSync(".env", envContent, { encoding: "utf8" });
  console.log("Deployment addresses saved to .env file.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});