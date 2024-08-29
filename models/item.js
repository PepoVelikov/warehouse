const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemNumber: { type: Number, unique: true, index: true},
  name: { type: String, unique: true, require: true},
  unit: { type: String, require: true},
  quantity: { type: Number, require: true},
  price: { type: Number, require: true}
});

module.exports = mongoose.model('Item', ItemSchema);