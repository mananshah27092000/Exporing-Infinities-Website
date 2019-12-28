const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const db = require('./config/db');

const app = express();

mongoose.connect(db.url, { useUnifiedTopology: true }, (err) => {
  if (err) return console.log(err);
  console.log('Database Connected!!')
})

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/root'))

const port = 3000;
app.listen(port, () => {
  console.log("server is working");
})
