const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/db');
const passport = require('passport');

const app = express();


require('./config/passport')(passport);

mongoose.connect(db.url, { useUnifiedTopology: true }, (err) => {
  if (err) return console.log(err);
  console.log('Database Connected!!')
})


app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.errors = req.flash('error');
  next();
})

app.use('/', require('./routes/root'))

const port = 3000;
app.listen(port, () => {
  console.log("server is working");
})