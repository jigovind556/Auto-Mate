const Server = "http://127.0.0.1:3001";
const Server2 = Server + "/chat";
var socket = io(Server);
var User;

// eventlisteners

function check_mates() {
  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "/" +
    (nowDate.getMonth() + 1) +
    "/" +
    nowDate.getDate();
  var data = {
    To: document.getElementById("To").value,
    From: document.getElementById("From").value,
    Date: date,
    Time: document.getElementById("Time").value,
  };
  if (data.To != "" && data.From != "") {
    socket.emit("check_mate", data);
  }
}

socket.on("receive_message", (message) => {
  console.log(message);
  var mate = document.getElementById("Matebox");
  mate.innerHTML="";
  // var time = message[i].travel_time;
  // var date =
  //   time.gethour() +
  //   "/" +
  //   (date.getMinute() + 1) ;
  for (var i = 0; i < message.length; i++) {
    console.log(message[i].name);
    mate.innerHTML += `
    <div class="people1" value="`+message[i].chatRoom_id+`" onclick="join_chatgroup('`+message[i].chatRoom_id+`')">
    <div class="info"> 
        <div class="name"><h4>`+message[i].name+`</h4></div>
        <div class="time"><h4>`+message[i].travel_time.slice(0,5)+`</h4></div>
        <i class="fa-solid fa-users"> `+message[i].No_of_person+`</i> 

        </div>
    </div>`;
  }
});
socket.on("createChat",(chatid)=>{
  var form=document.getElementById("chatForm");
  form.username.value=User.id;
  form.room.value=chatid;
  form.submit();
  // socket.emit('joinRoom' , {username, room})
});
socket.on("error", (message) => {
  console.log(message);
});

checkCookie();

function checkCookie() {
  var user = accessCookie("user");
  if (user != "") {
    User = JSON.parse(user);
    var button2 = document.getElementById("Submit_buttons");
    var nav=document.getElementById("navbar");
    nav.innerHTML+=`<li><a href="myaccount.html"><i class="fa-solid fa-user"></i></a></li>`;
    var button = document.getElementById("signinButton");
    button.innerHTML += `<button id="logout" onclick="logout()">Logout</button>`;
    button2.innerHTML += `<button id="submit" onclick="submitData()">submit</button>`;
  } else {
    var button = document.getElementById("signinButton");
    button.innerHTML = `<button id="login" onclick="login()">Login</button>`;
  }
}
function accessCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function logout() {
  document.cookie = "user=''; expires=Thu, 18 Dec 2013 12:00:00 UTC";
  window.location.href = "index.html";
}
function login() {
  window.location.href = "signin.html";
}
function submitData() {
  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "/" +
    (nowDate.getMonth() + 1) +
    "/" +
    nowDate.getDate();
  var data = {
    Email: User.id,
    To: document.getElementById("To").value,
    From: document.getElementById("From").value,
    Date: date,
    Time: document.getElementById("Time").value,
    chatid:Date.now()+Math.floor(Math.random() * 100)
  };
  if (data.To != "" && data.From != "") {
    socket.emit("submit_new_data", data);

  }
}



function join_chatgroup(chatid){
  // var form=document.getElementById("chatForm");
  // form.username.value=User.id;
  // form.room.value=chatid;
  // form.submit();
  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "/" +
    (nowDate.getMonth() + 1) +
    "/" +
    nowDate.getDate();
  var data = {
    Email: User.id,
    To: document.getElementById("To").value,
    From: document.getElementById("From").value,
    Date: date,
    Time: document.getElementById("Time").value,
    chatid:chatid
  };
  console.log(chatid);
 
  socket.emit("joinchat", data);
}
