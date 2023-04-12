const { ethers, BigNumber } = require('ethers');

const MarketplaceAddress = require('../contractsData/Marketplace-address.json');
const MarketplaceAbi = require('../contractsData/Marketplace.json');
const NFTAbi = require('../contractsData/NFT.json');
const NFTAddress = require('../contractsData/NFT-address.json');
const TokenAddress = require('../contractsData/Token-address.json');
const TokenAbi = require('../contractsData/Token.json');
const fetch = require('node-fetch');

require('dotenv').config();

// --------IPFS CONFIG ------------------
const { create } = require('ipfs-http-client');
const client = create(process.env.IPFS_LOCAL_API);
const provider = new ethers.providers.JsonRpcProvider(
	process.env.GANACHE_RPC_LINK
);

exports.loadMarketplaceItems = async (req, res, next) => {
	const signer = provider.getSigner();

	try {
		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);
		const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

		const itemCount = await marketplace.itemCount();
		let items = [];

		for (let i = 1; i <= itemCount; i++) {
			const item = await marketplace.items(i);
			// console.log('MARKETPLACE_ITEMS' item);
			if (!item.sold) {
				// get uri url from nft contract
				const uri = await nft.tokenURI(item.tokenId);
				// use uri to fetch the nft metadata stored on ipfs
				const response = await fetch(uri);
				const metadata = await response.json();
				// get total price of item (item price + fee)
				const totalPrice = await marketplace.getTotalPrice(item.itemId);
				// Add item to items array
				items.push({
					totalPrice,
					itemId: item.itemId,
					tokenId: item.tokenId,
					seller: item.seller,
					name: metadata.name,
					description: metadata.description,
					image: metadata.image,
				});
			}
		}

		res.status(200).send(items);
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};

exports.createNftAndMint = async (req, res, next) => {
	const { image, price, name, description, account } = req.body;
	console.log('REQ BODYs', req.body);
	const signer = provider.getSigner(account);

	try {
		// res.send({ image: image, price: price name: name, description:description});
		const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
		const token = new ethers.Contract(
			TokenAddress.address,
			TokenAbi.abi,
			signer
		);
		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);
		const balance = await token.balanceOf(account);
		const transferAnount = ethers.utils.parseEther(price);

		const mintThenList = async (result) => {
			const uri = `${process.env.IPFS_GATEWAY_LINK}/${result.path}`;

			// calling nft mint function
			await (await nft.mint(uri)).wait();

			// get tokenId of new nft
			const id = await nft.tokenCount();

			// approve marketplace to spend nft
			await (await nft.setApprovalForAll(marketplace.address, true)).wait();

			// add nft to marketplace
			const listingPrice = ethers.utils.parseEther(price.toString());

			// console. log('ID', id, 'LISTING_PRICE', listingPrice);
			await (
				await marketplace.makeItem(nft.address, id, listingPrice)
			).wait();
		};

		if (parseInt(balance) > parseInt(price)) {
			const result = await client.add(
				JSON.stringify({ image, price, name, description })
			);
			mintThenList(result);
			res.status(201).send({ msg: 'NFT CREATED' });
		} else {
			res.status(400).send({
				msg: "You don't have enough tokens to List Item. Please Buy Tokens",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};

exports.reListNft = async (req, res, next) => {
	const { item, account, price } = req.body;
	const signer = provider.getSigner(account);

	try {
		// res.send({ image: image, price: price, name: name, description: description });
		const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);

		// approve marketplace to spend nft
		console.log('PROCESS-1');
		await (await nft.setApprovalForAll(marketplace.address, true)).wait();
		console.log('PROCESS-2 APPROVED SUCCESSS');

		// add nft to marketplace
		// const listingprice = ethers.utils.parseEther(item.totalPrice.tostring());
		console.log('PROCESS-3 LISTING IN PROCESS');

		console.log('ID', item.itemId, 'LISTING_ PRICE', item.price);

		await (
			await marketplace.makeItem(nft.address, item.tokenId, item.price)
		).wait();

		console.log('PROCESS-4 LISTING DONE');
		res.status(201).send({ msg: 'NFT RE-LISTED' });
	} catch (error) {
		console.log(error);
		res.status(404).send({ msg: 'cannot relist item again' });
	}
};

exports.buyNFTs = async (req, res, next) => {
	const { item, account } = req.body;
	const signer = provider.getSigner(account);

	try {
		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);

		const token = new ethers.Contract(
			TokenAddress.address,
			TokenAbi.abi,
			signer
		);
		const itemCount = await marketplace.itemCount();

		const balance = await token.balanceOf(account);
		// console.log("BALANCE", parseInt(balance))
		const transferAmount = Math.round(
			parseFloat(ethers.utils.formatEther(item.totalPrice))
		);

		// console.log("TRANSFERAMAOUNT", transferAmount)

		if (balance < transferAmount) {
			res.status(400).send({
				msg: "You don't have enough tokens. Please Buy Tokens",
			});
		} else if (item.itemId > 0 && item.itemId <= itemCount) {
			res.status(400).send({ msg: "item Doesn't Exist" });
		} else if (item.sold) {
			res.status(400).send({ msg: 'item already sold' });
		} else if (account.toLowerCase() == item.seller.toLowerCase()) {
			res.status(400).send({ msg: "Owner Can't Buy Own items" });
		} else {
			const transfer = await token.transfer(item.seller, transferAmount);

			if (transfer) {
				const buy = await marketplace.buyNFT(item.itemId, item.tokenId);
				await buy.wait();
				res.status(200).send({ msg: 'Item Purchased Successfully!' });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
};

exports.myListedItem = async (req, res, next) => {
	const signer = provider.getSigner();
	const { account } = req.body;

	try {
		const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);
		const itemCount = await marketplace.itemCount();

		let listedItems = [];
		let soldItems = [];

		for (let indx = 1; indx <= itemCount; indx++) {
			const i = await marketplace.items(indx);
			if (i.seller.toLowerCase() == account.toLowerCase()) {
				// get uri url from nft contract
				const uri = await nft.tokenURI(i.tokenId);

				//  use uri to fetch the nft metadata stored on ipfs
				const response = await fetch(uri);
				const metadata = await response.json();
				// get total price of item (item price + fee)
				const totalPrice = await marketplace.getTotalPrice(i.itemId);
				// define Listed item object

				let item = {
					totalPrice,
					price: i.price,
					itemId: i.itemId,
					name: metadata.name,
					description: metadata.description,
					image: metadata.image,
				};

				listedItems.push(item);

				// Add listed item to sold items array if sold
				if (i.sold) soldItems.push(item);
			}
		}
		res.status(200).send({ soldItems, listedItems });
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};

exports.myPurchasedItem = async (req, res, next) => {
	const signer = provider.getSigner();
	const { account } = req.body;
	try {
		const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);

		// Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
		const filter = marketplace.filters.Bought(
			null,
			null,
			null,
			null,
			null,
			account
		);
		const results = await marketplace.queryFilter(filter);
		// console.log('FILTERED RESULT', results);

		//Fetch metadata of each nft and add that to listedItem object.

		const purchases = await Promise.all(
			results.map(async (i) => {
				// fetch arguments from each result
				i = i.args;
				// get uri url from nft contract
				const uri = await nft.tokenURI(i.tokenId);
				// use uri to fetch the nft metadata stored on ipfs
				const response = await fetch(uri);

				// console. log('REPONSE', response);
				const metadata = await response.json();

				// console. log("METADATA", metadata)
				// get total price of item (item price + fee)
				const totalPrice = await marketplace.getTotalPrice(i.itemId);
				// define listed item object
				let purchasedItem = {
					totalPrice,
					price: i.price,
					itemId: i.itemId,
					tokenId: i.tokenId,
					name: metadata.name,
					description: metadata.description,
					image: metadata.image,
				};

				return purchasedItem;
			})
		);

		res.status(200).send(purchases);
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};

exports.getOwnerHistory = async (req, res, next) => {
	const { item, account } = req.body;
	const signer = provider.getSigner(account);

	try {
		const marketplace = new ethers.Contract(
			MarketplaceAddress.address,
			MarketplaceAbi.abi,
			signer
		);

		const ownerHistory = await marketplace.getItemOwnerHistory(item.tokenId);
		// console.log({ ownerHistory }):
		let result = [];

		ownerHistory.forEach((i) => {
			let obj = {};
			obj['owner'] = i.owner;
			obj['userAction'] = i.userAction;
			result.push(obj);
		});
		res.status(200).send(result);
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
};
