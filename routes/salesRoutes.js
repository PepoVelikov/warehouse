const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sale = require('../models/sale');
const Item = require('../models/item');

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { partnerId, items } = req.body;

  if (!partnerId || !items || items.length === 0) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const newSale = new Sale({ partnerId, items });
    await newSale.save();

    for (let i = 0; i < items.length; i++) {
      const saleItem = items[i];

      const item = await Item.findOne({ name: saleItem.itemName });
      if (item) {
        item.quantity -= saleItem.itemQuantity;

        if (item.quantity < 0) {
          return res.status(400).send(`Not enough ${saleItem.itemName} in stock`);
        }
        await item.save();
      }
    }

    res.status(201).json(newSale);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Error adding sale', error });
  }
});

module.exports = router;