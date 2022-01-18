class connectionObject {
    constructor(id, name, topic, location, details, date, startTime, endTime, hostName, image) {
        this.id = id;
        this.name = name;
        this.topic = topic;
        this.location = location;
        this.details = details;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.hostName = hostName;
        this.image = image;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getName(){
        return this.name;
    }

    setName(a){
        this.name = a;
    }

    getTopic(){
        return this.topic;
    }

    setTopic(a){
        this.topic = a;
    }

    getLocation(){
        return this.location;
    }

    setLocation(a){
        this.locaiton = a;
    }

    getDetails(){
        return this.details;
    }

    setDetails(a){
        this.details = a;
    }

    getDate(){
        return this.date;
    }

    setDate(a){
        this.date = a;
    }

    getStartTime(){
        return this.startTime;
    }

    setStartTime(a){
        this.startTime = a;
    }

    getEndTime(){
        return this.endTime;
    }

    setEndTime(a){
        this.endTime = a;
    }

    getHostName(){
        return this.hostName;
    }

    setHostName(a){
        this.hostName = a;
    }

    getImage(){
        return this.image;
    }

    setImage(a){
        this.image = a;
    }
}

module.exports = connectionObject;
