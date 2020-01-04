const passport = require('passport');
const GoogleStratergy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');
const User = require('../models/schema');
const Facebook = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
})


passport.use(new LocalStrategy({usernameField : 'email'},function(email,password,done){
    User.findOne({email : email}).then((newUser)=>{
        bcrypt.compare(password,newUser.password,(err,result)=>{
            if(result){
                done(null,newUser);
            }else{
                done(null,false);
            }
        })
    })
    .catch((err)=>{
        console.log(err);
        done(null,false);
    });

}));


passport.use(new Facebook({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "http://127.0.0.1:3000/loginUser/facebook/callback",
    profileFields: ['email', 'name']
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({email : profile.email},(err,currentUser)=>{
            if(currentUser){
                done(null,currentUser);
            }else{
                new User({
                    username:profile.displayName,
                    email:profile.email
                }).save().then((newUser)=>{
                    done(null,newUser);
                });
            }
        })

    }
));



passport.use(new GoogleStratergy({
    clientID:     keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://127.0.0.1:3000/loginUser/google/callback"
},(accesToken,refreshToken,profile,done)=>{

    User.findOne({email : profile.email},(err,currentUser)=>{
        if(currentUser){
            done(null,currentUser);
        }else{
            new User({
                username:profile.displayName,
                email:profile.email
            }).save().then((newUser)=>{
                done(null,newUser);
            });
        }
    })}

))