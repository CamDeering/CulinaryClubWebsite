const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

//GET /index: gets the home page
router.get('/', controller.index);

//GET /contact: gets the contact page
router.get('/contact', controller.contact);

//GET /about: gets the about page
router.get('/about', controller.about);

module.exports = router;