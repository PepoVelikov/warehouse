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
  const { selectedPartner, items } = req.body;

  try {
    const newSale = new Sale({ selectedPartner, items });
    await newSale.save();
    
    for (let item of items) {
      const currentItem = await Item.findOne({ name: item.itemName });
      if (!currentItem) {
        return res.status(404).send(`Item ${item.itemName} not found`);
      }
      
      if (currentItem.quantity < item.itemQuantity) {
        return res.status(400).send(`Insufficient quantity for item ${item.itemName}`);
      }
      
      currentItem.quantity -= item.itemQuantity;
      await currentItem.save();
    }

    res.status(201).json(newSale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;