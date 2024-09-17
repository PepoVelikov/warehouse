const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: 'Partner',
    require: true
  },
  items: [
    {
      itemName: { type: String, require: true },
      itemQuantity: { type: Number, require: true },
      itemPrice: { type: Number, require: true }
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);