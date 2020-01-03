const express = require('express');
const router = express.Router();
const User = require('../models/schema');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Default Root
router.get('/', (req, res) => {
    res.render('signIn');
})

//login Page
router.get('/signIn', (req, res) => {
    res.render('signIn');
})


//Registration Page
router.get('/signUp', (req, res) => {
    res.render('signUp');
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/loginUser/signIn');
})
//Form Respose of Sign Up
router.post('/signUp', (req, res) => {

    let form = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        password2 : req.body.password2
    }

    if(form.username == '' || form.email == '' || form.password == '' || form.password2 == '')
        warnings.push('Please fill in the required details');

    if (form.password != form.password2) 
        warnings.push('Password did not match');

    if (warnings.length > 0) 
        res.render('signUp', { warnings , username : form.username ,email: form.email, password : form.password, password2 : form.password2 });
    else {
        User.findOne({ email: email }, (err, currentUser) => {
            if (err) return console.log(err);
            if (currentUser) {
                warnings.push('This email has already been registered');
                res.render('signUp', { warnings, username : form.username ,email: form.email, password : form.password, password2 : form.password2  });
            }
            else {
                User.findOne({ username : username }, (err, currentUser) => {
                    if (err) return console.log(err);
                    if (currentUser) {
                        warnings.push('This username has already been taken. Try another!!!');
                        res.render('signUp', { warnings, username : form.username ,email: form.email, password : form.password, password2 : form.password2  });
                    }
                    else {
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(password,salt,(err,hash)=>{
                                form.password = hash;
                                const NewUser = new User({
                                    username : form.username, 
                                    email: form.email,
                                    password: form.password,
                                })
                                NewUser.save(function (err, user) {
                                    if (err) return console.log(err);
                                    res.redirect('/signIn');
                                })
                            })
                        })
                    }
                })
            }
        })
    }
})

//Form Response from Sign In
router.post('/signIn',(req,res)=>{

})


router.get('/google',passport.authenticate('google',{
    scope : ['profile','email']
}));

router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
    // res.send('Hello');
    res.redirect('/users/');
});

router.get('/facebook',passport.authenticate('facebook',{
    scope : ['profile','email']
}));

router.get('/facebook/callback',passport.authenticate('facebook'),(req,res)=>{
    // res.send('Hello');
    res.redirect('/users/');
});

module.exports = router;