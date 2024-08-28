const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/auth');
const Purchase = require('../models/purchase');

router.get('/', auth, async (req, res) => {
  try {
    const purchase = await Purchase.find();
    res.json(purchase);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/api/purchase', async (req, res) => {
  console.log(req.body);
  try {
    const newPurchase = new Purchase(req.body);
    const purchase = await newPurchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating purchase', error });
  }
});

module.exports = router;