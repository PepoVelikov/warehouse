const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, require: true},
  unit: { type: String, require: true},
  price: { type: Number, require: true}
});

module.exports = mongoose.model('Item', ItemSchema);