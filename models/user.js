const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true},
  password: { type: String, require: true, unique: true },
  date: { type: Date, default: Date.now},
  email: { type: String, require: true, unique: true}
});

module.exports = mongoose.model('User', UserSchema);