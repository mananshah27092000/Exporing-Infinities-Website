const express = require('express');
const router = express.Router();
const model = require('../models/schema')
const passport = require('passport')

//welcome page after authentication
router.get('/welcome', (req, res) => {
  res.render('welcome', {
    user: req.user
  });
})


//Default Root
router.get('/', (req, res) => {
  res.render('signIn');
})

//Registration Page
router.get('/signUp', (req, res) => {
  res.render('signUp');
})
router.post('/signUp', (req, res) => {
  const Handle = req.body.Handle;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  const warnings = []

  if (Handle == '' || email == '' || password == '' || password2 == '') {
    warnings.push('Please fill in the required details');
  }
  if (password != password2) {
    warnings.push('password did not match');
  }
  if (warnings.length > 0) {
    res.render('signup', { warnings, Handle, email, password, password2 });
  }
  else {
    model.findOne({ email: email }, (err, doc) => {
      if (err) return console.log(err);
      if (doc) {
        warnings.push('This email has already been registered');
        res.render('signUp', { warnings, Handle, email, password, password2 });
      }
      else {
        model.findOne({ Handle: Handle }, (err, doc) => {
          if (err) return console.log(err);
          if (doc) {
            warnings.push('This Handle has already been taken. Try another!!!');
            res.render('signUp', { warnings, Handle, email, password, password2 });
          }
          else {
            const New = new model({
              Handle: Handle,
              email: email,
              password: password,
            })
            New.save(function (err, doc) {
              if (err) return console.log(err);
              req.flash('success_messages', 'You have successfully registered');
              res.redirect('/signIn');
            })
          }
        })
      }
    })
  }
})


//login Page
router.get('/signIn', (req, res) => {
  res.render('signIn');
})

router.post('/signIn', (req, res, next) => {
  const Handle = req.body.Handle;
  const password = req.body.password;
  const warnings = [];
  if (Handle == '' || password == '') {
    warnings.push('Please fill in the missing details');
  }
  if (warnings.length > 0) {
    res.render('signIn', { warnings, Handle, password });
  }
  else {
    passport.authenticate('local', {
      successRedirect: '/welcome',
      failureRedirect: '/signIn',
      failureFlash: true
    })(req, res, next)
  }
})

//facebook login
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/welcome',
    failureRedirect: '/signIn'
  }),
);


//google login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/welcome',
    failureRedirect: '/signIn'
  }),
);


module.exports = router;