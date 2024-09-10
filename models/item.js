const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemNumber: { type: Number, unique: true, index: true},
  name: { type: String, unique: true, required: true},
  unit: { type: String, required: true},
  quantity: { type: Number, required: true},
  price: { type: Number, required: true}
});

module.exports = mongoose.model('Item', ItemSchema);