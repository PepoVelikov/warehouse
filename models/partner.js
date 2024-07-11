const mongoose = require('mongoose');

const PartnerShema = new mongoose.Schema({
  name: { type: String, require: true},
  bulstat : { type: String, require: true},
  address: { type: String, require: true},
  phoneNumber: { type: Number, require: true},
  email: { type: String, require: true}
});

module.exports = mongoose.model('Partner', PartnerShema);