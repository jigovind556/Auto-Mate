const chatForm = document.getElementById('chat-form')
const chatMessage = document.getElementById('chat')
const userList = document.getElementById('user_list')
const Server = "http://127.0.0.1:3001";
const Server2 = Server + "/chat";
var socket = io(Server);

//Get User name and from URL
const {username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})

console.log(username, room);

function time(message){
    const div = document.createElement('div');
    div.classList.add('time');
    div.innerHTML = `${message.time}`;
    
    document.getElementById('chat').appendChild(div);
}

function timeOld(message){
  const div = document.createElement('div');
  div.classList.add('time');
  div.innerHTML = `${message.time}`;
  
  document.getElementById('chat').appendChild(div);
}




// const socket = io();

// Join Chat room
socket.emit('joinRoom' , {username, room})

// Get room and users
socket.on('roomUsers', async ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);

    let result = await fetch("mongodb+srv://aeromodelling-signup:Shivam114@cluster0.skf6mst.mongodb.net/auto-mate?room=" + room)
    .then(res => res.json());
    this.chatMessages = result.messages;
    
  });

//Message from server
socket.on('message', (message) =>{
    console.log(message);
    time(message)
    outputMessage(message)

    //Scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

socket.on('output-message', (message) =>{
  console.log(message);
  
  // if(message.length){
  //   message.text.message.forEach((message) =>{
  //     timeOld(message) 
  //     outputMessageOld(message.text.message)
  //   });
  // }
  const messageVar = message.text.message;
    for(let i = 0; i < messageVar.length; i++)
    {
      timeOld(message)
      var msg_value = message.text.message[i];
      outputMessageOld(msg_value);
      console.log("print");
    }



  //Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit' , e =>{
    e.preventDefault();

    //Get Text Message
    const msg = e.target.elements.msg.value;

    //EMit messgae to the server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//Output message to dom

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<div class="user_detail">
    <p class="user_name">${message.username}</p>
    <p class="chat_time">${message.time}</p> 
  </div>
  ${message.text}`;

    document.getElementById('chat').appendChild(div);
}

//Add Room Name
function outputRoomName(room){
    console.log(room);
    outputRoomName.innerText = room;
}

function outputMessageOld(message){
  console.log(message);
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<div class="user_detail">
  <p class="user_name">${message.username}</p>
  <p class="chat_time">${message.time}</p> 
</div>
${message.msg}`;

  document.getElementById('chat').appendChild(div);
}

//Add Room Name
function outputRoomName(room){
  console.log(room);
  outputRoomName.innerText = room;
}


function outputUsers(users) {
    const div = document.createElement('div');
    div.classList.add('contact')
    div.innerHTML = `<div class="pic danvers"></div>
    <div class="badge">
      2
    </div>
    <div class="name">
      ${users.username}
    </div>
    <div class="message">
      Hey Peter Parker, you got something for me?
    </div>` 
    document.getElementById('user_list').appendChild(div);
  }
  

document.getElementById('room_name').innerHTML = room;



