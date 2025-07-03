const express = require('express');
const router = express.Router();
const { getRevenueByMonth } = require('../controllers/statsController'); //  đúng đường và đúng tên
const { protect, admin } = require('../middleware/authMiddleware');
const { getOverviewStats } = require('../controllers/statsController');

//  Định nghĩa route đúng
router.get('/revenue-by-month',protect, admin,getRevenueByMonth);
router.get('/overview', protect, admin, getOverviewStats);
module.exports = router;
