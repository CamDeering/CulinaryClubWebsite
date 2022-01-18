//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const mainRouter = require('./routes/mainRoutes');
const connectionRouter = require('./routes/connectionRoutes');
const userRouter = require('./routes/userRoutes');
const User = require('./models/user');

//create application
const app = express();

//configure application
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect('mongodb://localhost:27017/club', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    //start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err => console.log(err.message));

//mount middleware
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/club'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.use('/', mainRouter);
app.use('/connection', connectionRouter);
app.use('/users', userRouter);

//error handling
app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error.");
    }
    res.status(err.status);
    res.render('error', {error: err});
});