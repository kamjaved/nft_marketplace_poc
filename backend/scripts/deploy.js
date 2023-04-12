const { ethers } = require('hardhat');

async function main() {
	const [deployer] = await ethers.getSigners();

	console.log('Deploying contracts with the account:', deployer.address);
	console.log('Account balance:', (await deployer.getBalance()).toString());

	// Get the contractFactories and Signers here
	const NFT = await ethers.getContractFactory('NFT');
	const Token = await ethers.getContractFactory('Token');
	const Marketplace = await ethers.getContractFactory('Marketplace');

	//deploy contractsss
	const nft = await NFT.deploy();
	const token = await Token.deploy();
	console.log('--PRE--TOKEN_CONTRACT_ADDRESS', token.address);

	const marketplace = await Marketplace.deploy();
	// Save copies of each contracts abi and address to the frontend.
	saveFrontendFiles(nft, 'NFT');
	saveFrontendFiles(token, 'Token');
	saveFrontendFiles(marketplace, 'Marketplace');

	console.log('NFT_CONTRACT_ADDRESS', nft.address);
	console.log('NFT_ MARKET_CONTRACT_ADDRESS', marketplace.address);
	console.log('TOKEN_CONTRACT_ADDRESS', token.address);
}

function saveFrontendFiles(contract, name) {
	const fs = require('fs');
	const contractsDir = __dirname + '/../../backend/contractsData';

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir);
	}

	fs.writeFileSync(
		contractsDir + `/${name}-address.json`,
		JSON.stringify({ address: contract.address }, undefined, 2)
	);

	const contractArtifact = artifacts.readArtifactSync(name);

	fs.writeFileSync(
		contractsDir + `/${name}.json`,
		JSON.stringify(contractArtifact, null, 2)
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
