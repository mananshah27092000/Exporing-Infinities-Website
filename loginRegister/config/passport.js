const LocalStartegy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStartegy = require('passport-google-oauth').OAuth2Strategy;
const model = require('../models/schema')
const facebookModel = require('../models/schema');

module.exports = function (passport) {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        model.findById(id, (err, doc) => {
            done(err, doc);
        });
    });

    passport.use(new LocalStartegy({ usernameField: 'Handle' }, (Handle, password, done) => {
        model.findOne({ Handle: Handle }, (err, Doc) => {
            if (err) return console.log(err);
            if (!Doc) {
                return done(null, false, { message: 'You have not registered' });
            }
            if (password != Doc.password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            else {
                return done(null, Doc);
            }
        })
    }))

    passport.use(new FacebookStrategy({
        clientID: "502852993670832",
        clientSecret: "5d739cacd35e83c2cbf73e8b5dbbf748",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['email', 'name']
    },
        (accessToken, refreshToken, profile, done) => {
            facebookModel.findOne({ 'facebook.userId': profile.id }, (err, Doc) => {
                if (err) return console.log(err);
                if (!Doc) {
                    const New = new facebookModel({
                        'facebook.userId': profile.id,
                        'facebook.token': accessToken,
                        'facebook.name': profile.name.givenName + ' ' + profile.name.familyName,
                        'facebook.email': profile.emails[0].value
                    })
                    New.save(function (err) {
                        if (err) return console.log(err);
                        return done(null, New);
                    })
                }
                else {
                    return done(null, Doc);
                }
            });
        }
    ));


    passport.use(new GoogleStartegy({
        clientID: "177154275511-gkeeshr6pgnhcc5orhtkvfj9hhnb2u04.apps.googleusercontent.com",
        clientSecret: "3vaMfN2ObduFQe-g8UYw4HUo",
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
        (accessToken, refreshToken, profile, done) => {
            facebookModel.findOne({ 'google.userId': profile.id }, (err, Doc) => {
                if (err) return console.log(err);
                if (!Doc) {
                    const New = new facebookModel({
                        'google.userId': profile.id,
                        'google.token': accessToken,
                        'google.name': profile.displayName,
                        'google.email': profile.emails[0].value
                    })
                    New.save(function (err) {
                        if (err) return console.log(err);
                        return done(null, New);
                    });
                }
                else {
                    return done(null, Doc);
                }
            });
        }
    ));

}