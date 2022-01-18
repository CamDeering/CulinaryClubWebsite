const { render } = require('ejs');
const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');

//renders the connections page
exports.connections = (req, res, next)=>{
    model.find()
    .then(connections=>{
        //get a set of all of the topics
        let topics = new Set();
        connections.forEach(item => {
            topics.add(item.topic);
        });
        const getNamesByTopic = (topic) => {
            return connections.filter(connection => connection.topic === topic);
        }
        res.render('connections', {connections, topics, getNamesByTopic});
    })
    .catch(err=>next(err));
};

//renders the newConnection page
exports.newConnection = (req, res)=>{
    res.render('newConnection');
};

//renders the connection page
exports.connection = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-f]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    Promise.all([model.findById(id).populate('hostName', 'firstName lastName'), rsvpModel.count({connection:id, rsvp: "YES"})])
    .then(results=>{
        const [connection, rsvps] = results;
        if(connection) {
            res.render('connection', {connection, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//deletes the conection and redirects to connections
exports.delete = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-f]{24}$/)){
        let err= new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), rsvpModel.deleteMany({connection:id})])
    .then(connection => {
        if(connection){
            req.flash('success', 'Successfully deleted connection and associated RSVPs');
            res.redirect('connections');
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err));
}

//gives the user a form with all the info of the connection in it to edit
exports.edit = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-f]{24}$/)){
        let err= new Error('Invalid conneciton id');
        err.status = 400;
        return next(err);
    }
    
    model.findById(id)
    .then(connection=>{
        if(connection) {
            return res.render('./edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

//updates the selected connection and reirects to that connection's page
exports.update = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-f]{24}$/)){
        let err= new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection => {
        if(connection){
            res.redirect('/connection/'+id);
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err)
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });
};


//creates a new connection and adds it to the database
exports.create = (req, res, next)=>{
    let connection = new model(req.body);
    connection.hostName = req.session.user;
    connection.save() //insert the doc to the database
    .then(connection => res.redirect('/connection/connections'))
    .catch(err=>{
        if(err.name = 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.editRsvp = (req, res, next) => {
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.findOne({connection: id, user:req.session.user})
    .then(rsvp=>{
        if(rsvp){
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp:req.body.rsvp}, {useFindAndModify: false, runValidators: true}).then(rsvp=>{
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                console.log(err);
                if(err.name === 'ValidationError') {
                    req.flash('error', error.message);
                    return res.redirect('/back');
                }
                next(err);
            });
        } else {
            //create
            let rsvp = new rsvpModel({
                connection: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp=>{
                req.flash('success', 'Successfully created RSVP');
                res.redirect("/users/profile");
            })
            .catch(err=>{
                req.flash('error', error.message);
                next(err);
            });
        }
    })
    .catch(err=>next(err));
}

exports.deleteRsvp = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.findOneAndDelete({conneciton: id, user: req.session.user})
    .then(rsvp=>{
        req.flash('success', 'Successfully deleted RSVP');
        res.redirect('/users/profile');
    })
    .catch(err=>{
        req.flash('error', err.message);
        next(err);
    });
}