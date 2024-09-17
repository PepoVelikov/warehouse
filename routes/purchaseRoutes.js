const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Purchase = require('../models/purchase');
const Item = require('../models/item');

router.get('/search-items', async (req, res) => {
  const { name} = req.query;

  try {
    const items = await Item.find({ name: new RegExp(name, 'i') });
    res.json(items);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching items', error });
  }
});

router.post('/', async (req, res) => {
  console.log('Received POST /purchase');
  const { partnerId, items } = req.body;

  if (!partnerId || !items || items.length === 0) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    const newPurchase = new Purchase({ partnerId, items });
    await newPurchase.save();
    console.log('Purchase saved:', newPurchase);
    
    for (let i = 0; i < items.length; i++) {
      const purchaseItem = items[i];

      const item = await Item.findOne({ name: purchaseItem.itemName });
      if (item) {
        item.quantity += purchaseItem.itemQuantity;
        await item.save();
      }
    }
    return res.status(201).json(newPurchase);

  } catch (error) {
    console.error('Error adding purchase:', error);
    return res.status(500).json({ msg: 'Error adding purchase', error });
  }
});

module.exports = router;