const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().sort({ itemNumber: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message : err.message });
  }
});

router.post('/', auth, async (req, res) => {
  console.log('Received POST request for adding item');
  console.log('Request body:', req.body);
  
  try {
    const lastItem = await Item.findOne().sort({ itemNumber: -1 });
    let newItemNumber = 1;
    if (lastItem) {
      newItemNumber = lastItem.itemNumber + 1;
    }
    
    const item = new Item({
      itemNumber: newItemNumber,
      name: req.body.name,
      unit: req.body.unit,
      quantity: req.body.quantity,
      price: req.body.price
    });
    console.log('New item created', item);
    
    const savedItem = await item.save();
    console.log('Item saved to database:', savedItem);
    res.status(201).json(savedItem);
  } catch (err) {
    console.log('Error saving item:', err.message);
    res.status(500).json({ message : err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, unit, quantity, price } = req.body;
  const itemFields = {};
  if (name) itemFields.name = name;
  if (unit) itemFields.unit = unit;
  if (quantity) itemFields.quantity = quantity;
  if (price) itemFields.price = price;

  try {
    let item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    item = await Item.findByIdAndUpdate(
      req.params.id, 
      { $set: itemFields }, 
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    await Item.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;