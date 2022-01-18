const {validationResult} = require('express-validator');
const {body} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateRsvp = [body('rsvp').isIn(['YES', 'NO', 'MAYBE'])];

exports.validateResults = (req,res,next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateSignUp = [body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 5 characters and at most 64 characters').isLength({min: 5, max: 64})];

exports.validateLogin = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 5 characters and at most 64 characters').isLength({min: 5, max: 64})];

exports.validateConneciton = [body('name', 'Connection name cannot be empty').notEmpty().trim().escape(),
body('topic', 'Topic cannot be empty').notEmpty().trim().escape(),
body('details', 'Details cannot be empty').notEmpty().trim().escape(),
body('location', 'Location cannot be empty').notEmpty().trim().escape(),
body('date', 'Date cannot be empty').notEmpty().trim().escape(),
body('startTime', 'Start time cannot be empty').notEmpty().trim().escape(),
body('endtTime', 'End time cannot be empty').notEmpty().trim().escape(),
body('hostName', 'Host name cannot be empty').notEmpty().trim().escape(),
body('imageURL', 'Image URL cannot be empty').notEmpty().trim().escape()];