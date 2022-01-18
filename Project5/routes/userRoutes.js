const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth')
const { validateSignUp, validateLogin, validateResults } = require('../middlewares/validators');
const { logInLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

//get user sign up form
router.get('/new', isGuest, controller.new);

//post to create a new user
router.post('/', isGuest, validateSignUp, validateResults, controller.create);

//get the login page
router.get('/login', isGuest, controller.login);

//post to process login request
router.post('/login', logInLimiter, isGuest, validateLogin, validateResults, controller.authenticate);

//get profile
router.get('/profile', isLoggedIn, controller.profile);

//logout the user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;