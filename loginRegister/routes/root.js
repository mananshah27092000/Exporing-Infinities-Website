const express = require('express');
const router = express.Router();
const User = require('../models/schema');
const bcrypt = require('bcryptjs');

//Default Root
router.get('/', (req, res) => {
    res.render('signIn');
})

//Registration Page
router.get('/signUp', (req, res) => {
    res.render('signUp');
})

router.post('/signUp', (req, res) => {

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    let warnings = []

    if(username == '' || email == '' || password == '' || password2 == '')
        warnings.push('Please fill in the required details');

    if (password != password2) 
        warnings.push('Password did not match');

    if (warnings.length > 0) 
        res.render('signUp', { warnings , username, email, password, password2 });
    else {
        User.findOne({ email: email }, (err, currentUser) => {
            if (err) return console.log(err);
            if (currentUser) {
                warnings.push('This email has already been registered');
                res.render('signUp', { warnings, username, email, password, password2 });
            }
            else {
                User.findOne({ username : username }, (err, currentUser) => {
                    if (err) return console.log(err);
                    if (currentUser) {
                        warnings.push('This Handle has already been taken. Try another!!!');
                        res.render('signUp', { warnings, Handle, email, password, password2 });
                    }
                    else {
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(password,salt,(err,hash)=>{
                                password = hash;
                                const NewUser = new User({
                                    username : username, 
                                    email: email,
                                    password: password,
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


//login Page
router.get('/signIn', (req, res) => {
    res.render('signIn');
})

module.exports = router;
//https://cloud.mongodb.com/v2/5e08686af2a30b4b762e95be#metrics/replicaSet/5e086982f2a30b4f2b6fe330/explorer/test/explorings/find