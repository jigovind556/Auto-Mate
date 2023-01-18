const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser , userLeave, getRoomUsers} = require('./utils/users');
const cors = require('cors');
// const dotenv = require('dotenv').config();
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb+srv://aeromodelling-signup:Shivam114@cluster0.skf6mst.mongodb.net/auto-mate?retryWrites=true&w=majority");

const botName = 'AutoMate ChatBot'
app.use(cors());

var collection;




const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.port;


//Set static folder
app.use(express.static(path.join(__dirname, '../chat') , async (req, res) => {
    try{
        let result = await collection.findOne({"room_name": req.query.room_name});
        res.send(result)
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}));

//Run when client connect
io.on('connection', socket =>{

    //
    socket.on('joinRoom', async ({username, room}) =>{

        try{
            let result = await collection.findOne({"room_name" : room});

            if(!result){
                await collection.insertOne({"room_name" : room , messages : []});
            }

            const user = userJoin(socket.id, username, room);

            socket.join(user.room);

            //Welcome connect user
            socket.emit('message', formatMessage(botName, 'Welcome to AutoMate-Chat'));

            //Broadcast when a user connects
            socket.broadcast
            .to(user.room)
            .emit(
                'message' , 
                formatMessage(botName, ` ${user.username} has joined the chat`)
            );

            socket.activeRoom = room;

            //Send users and room info 
            io.to(user.room).emit('roomUser', {
                room: user.room,
                users: getRoomUsers(user.room)
            })

            // Runs when clients dissconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

            //Send users and room info 
        io.to(user.room).emit('roomUser', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        }
        
    });
    

    //Listen for  chatMessage
    socket.on('chatMessage', msg =>{
        collection.updateOne({"room_name": socket.activeRoom} , {
            "$push" : {
                "message" : msg
            }
        })

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
        }
        catch(e){
            console.error(e);
        }

        

    })

    
    
})



server.listen(PORT, async ()=>{
    try {
        await client.connect().then();
        collection = client.db("auto-mate").collection("chats");
        console.log("Listening on port :3000", server.address().port);
    } catch (e) {
        console.error(e);
    }
}) 