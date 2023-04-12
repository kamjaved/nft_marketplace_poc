const { ethers } = require('ethers');
const TokenAddress = require('../contractsData/Token-address.json');
const TokenAbi = require('../contractsData/Token.json');

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(
	process.env.GANACHE_RPC_LINK
);

exports.getTokenDetail = async (req, res, next) => {
	const { account } = req.body;

	try {
		const token = new ethers.Contract(
			TokenAddress.address,
			TokenAbi.abi,
			provider
		);
		const getSymbol = await token.symbol();
		const getOwnerAddress = await token.owner();
		const getBalenceOfCurrentUser = await token.balanceOf(account);

		const resObject = {
			symbol: getSymbol,
			ownerAddress: getOwnerAddress,
			balance: parseInt(getBalenceOfCurrentUser),
		};
		res.status(200).send(resObject);
		// console.log(parseInt(getBalenceOfCurrentUser));
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};

exports.getTokenAmount = async (req, res, next) => {
	const { amount, account } = req.body;
	const signer = provider.getSigner(account);
	try {
		const token = new ethers.Contract(
			TokenAddress.address,
			TokenAbi.abi,
			signer
		);
		const transaction = await token.mint(parseInt(amount));
		await transaction.wait();
		res.status(200).send({
			msg: `${amount} EYT has been sent to your account succesfully!`,
		});
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};
