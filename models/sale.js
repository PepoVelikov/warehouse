const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  customerName: { type: String, require: true },
  customerBulstat: { type: String, require: true },
  customerAddress: { type: String, require: true },
  customerEmail: { type: String, require: true },
  customerPhone: { type: String, require: true },
  items: [
    {
      itemName: { type: String, require: true },
      itemQuantity: { type: Number, require: true },
      itemPrice: { type: Number, require: true }
    }
  ],
});

module.exports = mongoose.model('Sale', SaleSchema);