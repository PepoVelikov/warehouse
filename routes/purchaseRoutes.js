const express = require('express');
const router = express.Router();
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

router.post('/', async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;