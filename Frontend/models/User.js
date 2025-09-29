const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
  number: { type: String, default: '' },
  address: { type: String, default: '' },
  emailUpdateOTP: String,
  emailUpdateExpires: Date,
  newEmail: String,
});

module.exports = mongoose.model('User', userSchema);
