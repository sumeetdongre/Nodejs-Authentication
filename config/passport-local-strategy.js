const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const  bcrypt = require('bcryptjs');

//authentication using passport

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req,email,password,done){
        //find a user and establish the identity

        User.findOne({email: email}, function(err,user){
            if(err){
                 req.flash('error',err);
                return done(err);
            }

            if(!user || !bcrypt.compareSync(password, user.password)){
                 req.flash('error','Invalid Username/Password');
                return done(null, false);
            }

            return done(null,user); 
        });
    } 
));


// serializing the user 
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializing the user

passport.deserializeUser(function(id,done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null,user);
    });
});


//check user is authenticated
passport.checkAuthentication = function(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }

    else{
        return res.redirect('/users/signin');
    }
    
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;