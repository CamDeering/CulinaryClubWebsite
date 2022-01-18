const express = require('express');
const controller = require('../controllers/connectionController');
const { isLoggedIn, isAuthor, isNotAuthor} = require('../middlewares/auth');
const { validateId, validateRsvp, validateResults, validateConneciton } = require('../middlewares/validators');

const router = express.Router();

//GET /connection/connecitons: gets the connections page
router.get('/connections', controller.connections);

//GET /connection/newConnection: gets the newConnection page
router.get('/newConnection', isLoggedIn, controller.newConnection);

//POST /connections: create a new connection
router.post('/connections', isLoggedIn, validateResults, controller.create);

//GET /connection/connection/:id: gets the connection page
router.get('/:id', validateId, controller.connection);

//DELETE /connection/delete: deletes the connection the routes to connections page
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//GET /connection/:id/edit: send html form for editing an existing story
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /connection/:id: update the connection identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, validateConneciton, validateResults, controller.update);

router.post('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, validateRsvp, validateResults, controller.editRsvp);

router.delete('/:id/rsvp', validateId, isLoggedIn, controller.deleteRsvp)

module.exports = router;