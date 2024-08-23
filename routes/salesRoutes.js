const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/auth');
const Sale = require('../models/sale');

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const newSale = new Sale({
      itemId,
      quantity
    });

    const sale = await newSale.save();
    res.status(201).json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;