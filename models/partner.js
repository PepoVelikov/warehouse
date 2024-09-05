const mongoose = require('mongoose');

const PartnerShema = new mongoose.Schema({
  partnerNumber: { type: Number, unique: true, index: true},
  name: { type: String, unique: true, require: true},
  bulstat : { type: String, unique: true, require: true},
  address: { type: String, require: true},
  phone: { type: String, unique: true, require: true},
  email: { type: String, unique: true, require: true}
});

module.exports = mongoose.model('Partner', PartnerShema);