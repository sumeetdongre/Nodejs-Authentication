const passport = require('passport');
const googleStratergy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new stratergy for google login
passport.use(new googleStratergy({
        clientID: "537145220968-bj29kqimj2hgl26l7sh3mb2isdqdkkq3.apps.googleusercontent.com",
        clientSecret: "_jGmZ77ILGbeDcHiQSsYoU9Q",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){

        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){

            if(err){console.log('error in google stratergy-passport',err); return}

            console.log(accessToken, refreshToken);

            console.log(profile);

            if(user){
                //if found

                return done(null, user);


            }else{
                //if not found

                User.create({
                    name: profile.displayName,        
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err,user){
                    if(err){console.log('error in creating user google stratergy-passport',err); return}

                    return done(null, user);
                });
            }
        })
    }
));

module.exports = passport;