const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema  = new Schema({
    name: {type: String, required: [true, 'connection name is required.']},
    topic: {type: String, required: [true, 'connection topic is required.']},
    details: {type: String, required: [true, 'connection details are required.']},
    location: {type: String, required: [true, 'connection location is required.']},
    date: {type: Date, required: [true, 'Date is required.']},
    startTime: {type: String, required: [true, 'Start time is required.']},
    endTime: {type: String, required: [true, 'End time is required.']},
    hostName: {type: Schema.Types.ObjectId, ref: 'User'},
    imageURL: {type: String, required: [true, 'Image URL is required.']}
});

//collection name is connections in the database
module.exports = mongoose.model('Connections', connectionSchema);

//may or may not work
exports.getNamesByTopic = function(topic, connections) {
    console.log('test');
    let connectionsArray =  connections.filter(connection => connection.topic === topic);
    connectionsArray.forEach(connection => {
        console.log("connection name " + connection.name);
        namesArray.add(connection.name);
    });
    return namesArray;
}