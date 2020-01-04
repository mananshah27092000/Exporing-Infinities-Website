const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const User = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
});

var User_model = mongoose.model('User', User);

module.exports = User_model;
