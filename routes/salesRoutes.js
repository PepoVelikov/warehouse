const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity' });
    }

    item.quantity -= quantity;
    await item.save();

    res.status(200).json({ message: 'Item sold successfully', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;