const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const moment = require("moment");
const request = require('request');

const db = mysql.createConnection({
  user: "root",
  host: "automate.cs0gg5mbtn2b.ap-south-1.rds.amazonaws.com",
  password: "Shivam114",
  database: "auto_mate",
  multipleStatements: true,
});

// to get user info for signup page
app.post("/getUser",async (req, res) => {
  try {
    var email = req.body.email;

    console.log(email);
    db.query("select * from user where email =?;", [email], (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(102).send(new Error(err.sqlMessage));
      } else {
        console.log(result);
        res.send(result);
      }
    });
  } catch (error) {
    console.log("wrong user");
    res.status(102).send(new Error("data should not be blank"));
  }
});

// to get the user info for account page
app.post("/getcred",async (req, res) => {
  try {
    var email = req.body.email;

    console.log(email);
    db.query(
      "select name,Mobile_no from user where email =?;",
      [email],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } catch (error) {
    console.log("wrong user");
    res.status(102).send(new Error("data should not be blank"));
  }
});

//this function is to create account
app.post("/createuser",async (req, res) => {
  try {
    var name = req.body.name;
    var Email = req.body.Email;
    var Mobile_no = req.body.Mobile_no;
    var Password = req.body.Password;

    db.query(
      "insert into user (email,name,password,Mobile_no) values(?,?,?,?);",
      [Email, name, Password, Mobile_no],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          res.send("success");
        }
      }
    );
  } catch (error) {
    console.log("wrong user");
    res.status(102).send(new Error("data should not be blank"));
  }
});

// the function to change password
app.post("/changepwd",async (req, res) => {
  try {
    var email = req.body.email;
    var OldPwd = req.body.OldPwd;
    var NewPwd = req.body.NewPwd;
    var pwd;

    console.log(email);
    db.query(
      "select Password from user where email =?;",
      [email],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          // console.log(result[0].Password);
          pwd = result[0].Password;
          if (pwd == OldPwd) {
            db.query(
              `update user set Password=? where Email=?;`,
              [NewPwd, email],
              (err, result) => {
                if (err) {
                  console.log(err.sqlMessage);
                  res.status(102).send(new Error(err.sqlMessage));
                } else {
                  res.send("updated");
                }
              }
            );
          } else {
            res.send("nomatch");
          }
        }
      }
    );
  } catch (error) {
    console.log("wrong user");
    res.status(102).send(new Error("Wrong data format"));
  }
});

// The function to update user detail
app.post("/updtuser", async (req, res) => {
  try {
    var email = req.body.email;
    var name = req.body.name;
    var Mob = req.body.Mob;
    var f1= true,f2=true;
    console.log(f1,f2);
    if (name != "" && Mob=="") {
      db.query(
        `update user set name=? where Email=?;`,[name,email],
        (err, result) => {
          if (err) {
            console.log(err.sqlMessage);
            res.status(102).send(new Error(err.sqlMessage));
          } else {
            console.log(true);
            res.send("success");
          }
        }
      );
    }
    
    else if(name == "" && Mob!=""){
      db.query(
        `update user set Mobile_no=? where Email=?;`,[Mob,email],
        (err, result) => {
          if (err) {
            console.log(err.sqlMessage);
            res.status(102).send(new Error(err.sqlMessage));
          } else {
            console.log(true);
            res.send("success");
          }
        }
      );
    }
    else if(name!= "" && Mob != ""){
      db.query(
        `update user set name=? ,Mobile_no=? where Email=?;`,[name,Mob,email],
        (err, result) => {
          if (err) {
            console.log(err.sqlMessage);
            res.status(102).send(new Error(err.sqlMessage));
          } else {
            console.log(true);
            res.send("success");
          }
        }
      );
    }
   
  } catch (error) {
    res.status(102).send(new Error(error));
  }
});

// The function to get all places in a city
app.post("/places", async (req, res) => {
  try {
    db.query(
      "select place from places where city='kurukshetra';",
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          res.send(result);
        }
      }
    );
  } catch (error) {
    res.status(102).send(new Error(error));
  }
});

//function to get travel history of a person
app.post("/thistory", async (req, res) => {
  try {
    console.log(res.body);
    var email = req.body.email;
    var tim = req.body.time;
    var dat = req.body.date;
    db.query(
      `select cr.chatRoom_id,DATE_FORMAT(date,'%d-%b-%Y') as date,travel_Time,dest,jstart,No_of_person,room_name,travel_status
      from chatroom cr , chatgroup cg where 
      cr.chatRoom_id=cg.chatRoom_id and  cg.Email=? and cr.date<=? and
      cr.chatRoom_id not in
      (select cr2.chatRoom_id
      from chatroom cr2 where
      cr2.travel_time>? and cr2.date=? )
      order by date desc ,travel_Time desc;`,
      [email,dat,tim,dat],(err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          res.send(result);
        }
      }
    );
  } catch (error) {
    res.status(102).send(new Error(error));
  }
});

//function to get active chats of a person
app.post("/activechat", async (req, res) => {
  try {
    console.log(req.body);
    var email = req.body.email;
    var tim = req.body.time;
    var dat = req.body.date;
    db.query(
      `select cr.chatRoom_id,DATE_FORMAT(date,'%d-%b-%Y') as date,travel_Time,dest,jstart,No_of_person,room_name,nop_with_you as pwy
      from chatroom cr , chatgroup cg where 
      cr.chatRoom_id=cg.chatRoom_id and  cg.Email=? and cr.date>=? and 
      cr.chatRoom_id not in
      (select cr2.chatRoom_id
      from chatroom cr2 where
      cr2.travel_time<SUBTIME(?, 003000) and cr2.date=? )
      order by date asc ,travel_Time asc;`,
      [email,dat,tim,dat],(err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          res.send(result);
        }
      }
    );
  } catch (error) {
    res.status(102).send(new Error(error));
  }
});

// function delete chat
app.post("/deletechat", async (req, res) => {
  try {
    console.log(req.body);
    var email = req.body.email;
    var chatid= req.body.chatid;
    var pwy = req.body.pwy;
    db.query(
      `select No_of_person from chatroom where chatRoom_id=?;`,
      [chatid],(err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          console.log(result[0].No_of_person==pwy);
          if(result[0].No_of_person==pwy){
            db.query(
              `delete from chatroom where chatRoom_id=?;`,
              [chatid],(err, result) => {
                if (err) {
                  console.log(err.sqlMessage);
                  res.status(102).send(new Error(err.sqlMessage));
                } else {
                  res.send("success");
                }
              }
            );
          }
          else{
            db.query(
              `update chatroom set No_of_person = No_of_person-? where chatroom_id=?;
              delete from chatgroup where email=? and chatroom_id=?;`,
              [pwy,chatid,email,chatid],(err, result) => {
                if (err) {
                  console.log(err.sqlMessage);
                  res.status(102).send(new Error(err.sqlMessage));
                } else {
                  res.send("success");
                }
              }
            );
          }
          
        }
      }
    );
  } catch (error) {
    res.status(102).send(new Error(error));
  }
});

// CHAT CODE

const path = require("path");
// const express = require('express');
// const app = express();
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
// const cors = require('cors');
// const dotenv = require('dotenv').config();
const { MongoClient } = require("mongodb");
const { url } = require("inspector");

const client = new MongoClient(
  "mongodb+srv://aeromodelling-signup:Shivam114@cluster0.skf6mst.mongodb.net/auto-mate?retryWrites=true&w=majority"
);

const botName = "AutoMate ChatBot";
// app.use(cors());

var collection;

const server = http.createServer(app);
// const io = socketio(server);
var io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://127.0.0.1:5501",
      "http://127.0.0.1:5502",
      "https://jigovind556.github.io",
      "http://127.0.0.1:3001",
      "http://43.205.206.153:3001"
    ],
  },
});

// const io = require("socket.io")(server, {
//   allowRequest: (req, callback) => {
//     const noOriginHeader = req.headers.origin === undefined;
//     callback(null, noOriginHeader);
//   }
// });
// const PORT = 3000 || process.env.port;

//Set static folder
app.use(express.static(path.join(__dirname, "../"), async (req, res) => {
    try {
      let result = await collection.findOne({ room_name: req.query.room_name });
      res.send(result);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  })
);

var Filter = require('bad-words'),
filter = new Filter();
filter.addWords('bsdk', 'gandu', 'randi');


//Run when client connect
io.on("connection", (socket) => {
  //
  socket.on("joinRoom", async ({ username, room }) => {
    try {
      let result = await collection.findOne({ room_name: room });

      if (!result) {
        await collection.insertOne({
          room_name: room,
          messages: [],
          username: username,
        });
      }

      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      //Finding previous history
      collection.findOne({ room_name: room }).then((msg) => {
        // filter.clean(msg)
        socket.emit("output-message", formatMessage(user.username,msg));
      });

      //Welcome connect user
      socket.emit(
        "message",
        formatMessage(botName, "Welcome to AutoMate-Chat")
      );

      //Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, ` ${user.username} has joined the chat`)
        );

      socket.activeRoom = room;

      //Send users and room info
      io.to(user.room).emit("roomUser", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      // Runs when clients dissconnects
      socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
          io.to(user.room).emit(
            "message",
            formatMessage(botName, `${user.username} has left the chat`)
          );

          //Send users and room info
          io.to(user.room).emit("roomUser", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
        }
      });

      //Listen for  chatMessage
      socket.on("chatMessage", ({ msg, username }) => {
        const time = moment().utcOffset("+05:30").format("h:mm a");
        filter_msg = filter.clean(msg)
        collection.updateOne(
          { room_name: socket.activeRoom },
          {
            $push: {
              message: { username, filter_msg, time },
            },
          }
        );

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, filter_msg));
      });
    } catch (e) {
      console.error(e);
    }
  });

  console.log(socket.id + " for io2");

  socket.on("check_mate", async ({ To, From, Date, Time, Nop}) => {
    console.log(To, From, Time);
    db.query(
      `select room_name , travel_time ,chatRoom_id ,No_of_person from chatroom 
      where  dest=? and jstart=? and No_of_person<=? and
      date=? AND travel_time between SUBTIME(?, 003000) and ADDTIME(?, 003000);`,
      [To, From,Nop, Date, Time, Time],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          socket.emit("error", err.sqlMessage);
        } else {
          console.log(result);
          socket.emit("receive_message", result);
        }
      }
    );
  });

  socket.on(
    "submit_new_data",
    async ({ Email, To, Date, From, Time,Nop, chatid }) => {
      try {
        var nop2=5-Nop;
        console.log(chatid);
        // var chatid="1245624";
        db.query(
          `
      
      insert into chatroom (chatRoom_id,dest,jstart,room_name,travel_time,date,NO_of_person) values (?,?,?,
        (select name from user where Email=?),
      ?,?,?);
      insert into chatgroup (Email, chatRoom_id,nop_with_you) values (?,?,?); `,
          [chatid, To, From, Email, Time, Date,Nop, Email, chatid,Nop],
          (err, result) => {
            if (err) {
              console.log(err.sqlMessage);
              socket.emit("error", err.sqlMessage);
            } else {
              console.log(result);

              db.query(
               ` select room_name , travel_time ,chatRoom_id ,No_of_person from chatroom 
                where  dest=? and jstart=? and No_of_person<=? and
                date=? AND travel_time between SUBTIME(?, 003000) and ADDTIME(?, 003000);`,
                [To, From,nop2, Date, Time, Time],
                (err, result) => {
                  if (err) {
                    console.log(err.sqlMessage);
                    socket.emit("error", err.sqlMessage);
                  } else {
                    console.log(result);
                    socket.emit("receive_message", result);
                    socket.emit("createChat", chatid);
                  }
                }
              );
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("joinchat", async ({ Email, To, Date, From, Time,Nop, chatid }) => {
    console.log("Email " + Email + " chatid " + chatid);
    var nop2=5-Nop;
    db.query(
      `select * from chatgroup where Email=? and chatRoom_id=? ;`,
      [Email, chatid],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          socket.emit("error", err.sqlMessage);
        } else {
          if (result[0]) {
            socket.emit("createChat", chatid);
          } else {
            db.query(
              `
              update chatroom set No_of_person = No_of_person+? where chatroom_id=?;
              insert into chatgroup (Email, chatRoom_id,nop_with_you) values (?,?,?);`,
              [Nop,chatid, Email, chatid,Nop],
              (err, result) => {
                if (err) {
                  console.log(err.sqlMessage);
                  socket.emit("error", err.sqlMessage);
                } else {
                  console.log(result);
                  socket.emit("createChat", chatid);
                }
              }
            );
          }
        }
      }
    );
  });
});

// Google Calender Api Integration 



//

server.listen(3001, async () => {
  try {
    await client.connect().then();
    collection = client.db("auto-mate").collection("chats");
    console.log("Listening on port :", server.address().port);
  } catch (e) {
    console.error(e);
  }
});
