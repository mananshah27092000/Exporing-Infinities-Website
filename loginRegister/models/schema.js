const mongoose = require('mongoose');
const db = require('../config/db');

const schema = new mongoose.Schema({
  Handle: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  facebook: {
    userId: String,
    token: String,
    name: String,
    email: String
  },
  google: {
    userId: String,
    token: String,
    name: String,
    email: String
  }
}, {
  versionKey: false
})

var reg_model = mongoose.model('myModel', schema);

module.exports = reg_model;