const mongoose = require('mongoose');

const PartnerShema = new mongoose.Schema({
  partnerNumber: { type: Number, unique: true, index: true},
  name: { type: String, require: true},
  bulstat : { type: String, require: true},
  address: { type: String, require: true},
  phoneNumber: { type: String, require: true},
  email: { type: String, require: true}
});

module.exports = mongoose.model('Partner', PartnerShema);