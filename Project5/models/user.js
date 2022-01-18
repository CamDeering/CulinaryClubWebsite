const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: [true, 'cannot be empty']},
    lastName: {type: String, required: [true, 'cannot be empty']},
    email: {type: String, required: [true, 'cannot be empty'], unique: true},
    password: {type: String, required: [true, 'cannot be empty']}
});

userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      next();
    })
    .catch(err => next(error));
});
  
userSchema.methods.comparePassword = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
}

module.exports = mongoose.model('User', userSchema);