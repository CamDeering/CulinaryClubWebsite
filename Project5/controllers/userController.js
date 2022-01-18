const User = require('../models/user');
const connection = require('../models/connection');
const rsvpModel = require('../models/rsvp');

//get user sign up form
exports.new = (req, res) => {
    res.render('user/new');
}

//post to create a new user
exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
    .then(()=>{
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }
        if(err.code === 11000){
           req.flash('error', 'Email address has been used.');
           return res.redirect('/users/new'); 
        }
        next(err);
    });
}

//get the login page
exports.login = (req, res)=>{
    res.render('user/login');
}

//post to process login request
exports.authenticate = (req, res, next)=>{
    //authenticate user's login request
    let email = req.body.email;
    if(email) {
        email = email.toLowerCase();
    }
    let password = req.body.password;
    //get the user that matches the email
    User.findOne({email: email})
    .then(user=>{
        if(user){
            //user found
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id;//store user's id in the session
                    req.flash('success', 'You have sucessfully logged in!');
                    res.redirect('/users/profile');
                } else {
                    //console.log('wrong password');
                    req.flash('error', 'Wrong password!');
                    res.redirect('/users/login');
                }
            })
            .catch(err=>next(err));
        } else {
            //user not found
            //console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
}

//get profile
exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([User.findById(id), connection.find({hostName: id}), rsvpModel.find({user: id}).populate('connection')])
    .then(results=>{
        const [user, connections, rsvps] = results;
        res.render('./user/profile', {user, connections, rsvps})
    })
    .catch(err=>next(err));
}

//logout the user
exports.logout = (req, res, next) =>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
}