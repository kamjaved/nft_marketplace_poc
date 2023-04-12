const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/tokenController');

router.route('/load-token-detail').post(tokenController.getTokenDetail);
router.route('/get-token-amount').post(tokenController.getTokenAmount);

module.exports = router;
