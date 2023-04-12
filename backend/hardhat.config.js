require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

const { PRIVATE_KEY_ACCOUNT, RPC_API_URL } = process.env;

module.exports = {
	solidity: '0.8.4',
	paths: {
		artifcats: './artifacts',
		sources: './contracts',
		cache: './cache',
		tests: './test',
	},

	networks: {
		hardhat: {},
		ganache: {
			url: RPC_API_URL,
			accounts: [`0x${PRIVATE_KEY_ACCOUNT}`],
		},
	},
};
