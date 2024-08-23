const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/auth');
const Purchase = require('../models/purchase');

router.get('/', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const newPurchase = new Purchase({
      itemId,
      quantity
    });

    const purchase = await newPurchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;