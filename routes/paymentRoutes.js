const express = require("express");
const router = express.Router();
const { createZaloOrder } = require("../controllers/paymentController");

router.post("/zalopay", createZaloOrder);

module.exports = router;
