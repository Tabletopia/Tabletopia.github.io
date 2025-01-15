const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const myTokenAddress = process.env.MYTOKEN_ADDRESS;
  const tokenSaleAddress = process.env.TOKENSALE_ADDRESS;

  if (!myTokenAddress || !tokenSaleAddress) {
    throw new Error("Missing addresses in .env file.");
  }

  console.log(`MyToken Address: ${myTokenAddress}`);
  console.log(`TokenSale Address: ${tokenSaleAddress}`);

  // Connect to the MyToken contract
  const [deployer] = await ethers.getSigners();
  const myTokenContract = await ethers.getContractAt(
    "MyToken",
    myTokenAddress,
    deployer
  );

  // Fetch balances
  const deployerBalance = await myTokenContract.balanceOf(deployer.address);
  const tokenSaleBalance = await myTokenContract.balanceOf(tokenSaleAddress);

  console.log(`Deployer MTK Balance: ${ethers.formatUnits(deployerBalance, 18)} MTK`);
  console.log(`TokenSale Contract MTK Balance: ${ethers.formatUnits(tokenSaleBalance, 18)} MTK`);

  const tokenSaleContract = await ethers.getContractAt(
    "TokenSale",
    tokenSaleAddress,
    deployer
  );
  const tokenPrice = await tokenSaleContract.tokenPrice();
  console.log(`MTK Token Price is: ${ethers.formatUnits(tokenPrice, 18)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});