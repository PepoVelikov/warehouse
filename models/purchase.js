const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseName: { type: String, require: true },
  purchaseBulstat: { type: String, require: true },
  purchaseAddress: { type: String, require: true },
  purchaseEmail: { type: String, require: true },
  purchasePhone: { type: String, require: true },
  items: [
    {
      itemName: { type: String, require: true },
      itemQuantity: { type: Number, require: true },
      itemPrice: { type: Number, require: true }
    }
  ],
}, {
  timestamps: true
});

module.exports = mongoose.model('Purchase', purchaseSchema);