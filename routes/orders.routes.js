const express = require('express');
const {
  createOrder,
} = require('../controllers/order.controller');
const router = express.Router();

router.post('/', createOrder);

module.exports = router;
