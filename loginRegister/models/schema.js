const mongoose = require('mongoose');
const db = require('../config/db');

const schema = new mongoose.Schema({
  Handle: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

var reg_model = mongoose.model('myModel', schema);

module.exports = reg_model;
