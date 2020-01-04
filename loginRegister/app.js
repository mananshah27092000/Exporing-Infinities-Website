const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passportSetup = require('./config/passport-google'); 
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

const db = keys.url;
mongoose.connect(db, { useUnifiedTopology: true , useNewUrlParser : true })
  .then(()=>console.log('MongoDB connected'))
  .catch((err)=>console.log(err));


app.use(expressLayouts);
app.set('view engine', 'ejs');


app.use(cookieSession({
  maxAge : 24*60*60*1000,
  keys : [keys.session.cookieKey]
}))


app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));


app.use('/loginUser', require('./routes/loginUser'));
app.use('/users', require('./routes/users'));




const port = 3000 || process.env.PORT;
app.listen(port);

