const express = require('express');
const router = express.Router();
const marketPlaceController = require('../controllers/marketPlaceController');

router.route('/item-load').get(marketPlaceController.loadMarketplaceItems);
router.route('/create-mint-nft').post(marketPlaceController.createNftAndMint);
router.route('/relist-nft').post(marketPlaceController.reListNft);
router.route('/buy-nft').post(marketPlaceController.buyNFTs);
router.route('/user-listed-item').post(marketPlaceController.myListedItem);
router
	.route('/user-purchased-item')
	.post(marketPlaceController.myPurchasedItem);
router.route('/ownerhistory').post(marketPlaceController.getOwnerHistory);

module.exports = router;
