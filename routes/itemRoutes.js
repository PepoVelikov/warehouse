const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message : err.message });
  }
});

router.post('/', auth, async (req, res) => {
  console.log('Received POST request for adding item');
  console.log('Request body:', req.body);
  
  try {
    const newItem = new Item({
      name: req.body.name,
      unit: req.body.unit,
      quantity: req.body.quantity,
      price: req.body.price
    });

    console.log('New item created', newItem);
    
    await newItem.save();

    console.log('Item saved to database:', newItem);

    res.status(201).json(newItem);
  } catch (err) {
    console.log('Error saving item:', err.message);
    res.status(500).send('Server error');
  }
});    

module.exports = router;