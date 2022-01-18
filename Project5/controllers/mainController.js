const { render } = require('ejs');

//renders the home page
exports.index = (req, res)=>{
    res.render('index');
};

//renders the contact page
exports.contact = (req, res)=>{
    res.render('contact');
};

//renders the about page
exports.about = (req, res)=>{
    res.render('about');
};