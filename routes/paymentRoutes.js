const express = require('express');
const router = express.Router();
const {
    createZaloOrder,
    createMomoOrder,
    callbackMomo,
    createVNPAYOder,
    callbackVNPAY,
} = require('../controllers/paymentController');

router.post('/zalopay', createZaloOrder);
router.post('/momo', createMomoOrder);
router.post('/vnpay', createVNPAYOder); // Assuming you want to use the same controller for VNPAY
router.get('/momo/callback', callbackMomo);
// Uncomment the line below if you want to handle VNPAY callback
router.get('/vnpay/callback', callbackVNPAY);

module.exports = router;