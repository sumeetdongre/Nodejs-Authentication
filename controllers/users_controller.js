const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports.users = function(req,res){

    res.render('users',{
        title: "users"
    });
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_up',{
        title: "Signup"
    });
}



module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in',{
        title: "SignIn"
    })
    
    
    
}


module.exports.profile = function(req,res){
    User.findById(req.user.id, function(err,user){
        return res.render('user_profile',{
            title: "Profile",
            profile_user: user
        });
    })    
}


//create user by signup
module.exports.create = async function(req, res){
   
    try{
        let user = await User.findOne({email: req.body.email});

    if(req.body.password != req.body.confirm_password){
        req.flash('error', "Password do not match");
        return res.redirect('back');
    }

        if(!user){
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            
            await User.create({
                email: req.body.email,
                password: hash,
                name: req.body.name
            });
            console.log('registered');
            return res.redirect('/users/signin');
        }else{
            req.flash('error', 'Email already registered');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error' + err);
        return res.redirect('back');
    }
}

//create a session of logged user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfly');
    
    return res.redirect('/');
}

// update the password after login
module.exports.update = async function(req,res){
    try{

        let pass=req.body.password;
        console.log(pass);
        if(!pass){
            req.flash('error', 'Please enter password to change')
            return res.redirect('back');
        }

        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Pasword does not match!');
            return res.redirect('back');
        }
    
        let user = await User.findOne({email: req.user.email});


            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            
            user.password = hash;
            user.save();
            req.flash('Success', 'Password updated');
            return res.redirect('back');
        }
    catch(err){
        req.flash('error', 'Error in updating the password');
        return res.redirect('back');
    }   
}


//destroy a session of logged user
module.exports.destroySession = function(req,res){
    req.logout();
     req.flash('success', 'You have logged out!');
    return res.redirect('/');
}

