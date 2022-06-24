// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const Room = require("./models/Rooms");
const Message = require("./models/Messages");

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const messageHandler = require('./controllers/message.js');
const  roomIdGenerator  = require('./util/roomIdGenerator');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const db = config.get('mongoURI');

mongoose.connect(db, 
    err =>{
        if (err) throw err;
        console.log("Connected to MongoDB");
    });



// set up stylesheets route

// TODO: Add server side code

app.post("/create", function(req, res){
    const newRoom =  new Room({
        name: req.body.roomName,
        id: roomIdGenerator.roomIdGenerator()
    })
    newRoom.save().then(console.log("Room has been added!")).catch(err => console.log("Error when creating room!"))
});

app.post("/createMessage", function(req, res){
    const newMessage =  new Message({
        nickname: req.body.nickname,
        body: req.body.body,
        roomID: req.body.roomID,
        date: req.body.date
    })
    newMessage.save().then(console.log("Message has been added!")).catch(err => console.log("Error when creating room!"))
});

app.get("/getRoom", function(req, res) {
    Room.find().lean().then(item => {
        res.json(item)
    });
})

app.get("/roomName/messages", messageHandler.getMessage);

// Create controller handlers to handle requests at each endpoint
app.get('/', homeHandler.getHome);
app.get('/:roomName', roomHandler.getRoom);


// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));