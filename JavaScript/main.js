typeof Notification !== "undefined";
let permission = Notification.requestPermission();

// const Server2 = Server + "/chat";
var socket = io(Server);
var User;

// eventlisteners
// const tomorrow = (dt)=> {
function tomorrow(dt) {
  // Creating the date instance
  let d = new Date(dt);

  // Adding one date to the present date
  d.setDate(d.getDate() + 1);

  let year = d.getFullYear();
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());

  // Adding leading 0 if the day or month
  // is one digit value
  month = month.length == 1 ? month.padStart("2", "0") : month;

  day = day.length == 1 ? day.padStart("2", "0") : day;

  // Printing the present date
  // console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
}
// tomorrow("2020-12-31")

setOptions();
function setOptions() {
  setdate();
  setplaces();
}
function setdate() {
  var nowDate = new Date();
  var today = setdateformat(nowDate);
  var tomorro = setdateformat(tomorrow(today));
  var overmorrow = setdateformat(tomorrow(tomorro));

  var dt = document.getElementById("Day");
  dt.innerHTML =
    `
  <option value="` +
    today +
    `">Today</option>
  <option value="` +
    tomorro +
    `">Tomorrow</option>
  <option value="` +
    overmorrow +
    `">Overmorrow</option>
  `;
}

function setdateformat(dt) {
  var nowDate = new Date(dt);
  var today =
    nowDate.getFullYear() +
    "/" +
    (nowDate.getMonth() + 1) +
    "/" +
    nowDate.getDate();
  return today;
}
function setplaces() {
  const Server2 = Server + "/places";
  var data = "";
  axios
    .post(Server2, data)
    .then((res) => {
      place = res.data;
      var To = document.getElementById("To");
      var From = document.getElementById("From");
      for (let i = 0; i < place.length; i++) {
        To.innerHTML +=
          `<option value="` +
          place[i].place +
          `">` +
          place[i].place +
          `</option>`;
        From.innerHTML +=
          `<option value="` +
          place[i].place +
          `">` +
          place[i].place +
          `</option>`;
      }
    })
    .catch((err) => {
      console.log(err);
      // alert("Username already used Choose a different username");
    });
}

function check_mates() {
  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "/" +
    (nowDate.getMonth() + 1) +
    "/" +
    nowDate.getDate();
  var nop = 5 - document.getElementById("People").value;

  var data = {
    To: document.getElementById("To").value,
    From: document.getElementById("From").value,
    Date: document.getElementById("Day").value,
    Time: document.getElementById("Time").value,
    Nop: nop,
  };
  if (data.To != "" && data.From != "" && data.To != data.From) {
    socket.emit("check_mate", data);
  }
}

// tomorrow("2021-02-28")
// tomorrow("2021-4-30")

socket.on("receive_message", (message) => {
  console.log(message);
  var mate = document.getElementById("Matebox");
  mate.innerHTML = "";
  if (message.length == 0) {
    mate.innerHTML += "no one is available";
  } else {
    for (var i = 0; i < message.length; i++) {

      mate.innerHTML +=
        `
      <div class="people1" value="` +
        message[i].chatRoom_id +
        `" onclick="join_chatgroup('` +
        message[i].chatRoom_id +
        `')">
      <div class="info"> 
          <div class="name"><h4>` +
        message[i].room_name +
        `</h4></div>
          <div class="time"><h4>` +
        message[i].travel_time.slice(0, 5) +
        `</h4></div>
          <i class="fa-solid fa-users"> ` +
        message[i].No_of_person +
        `</i> 

          </div>
      </div>`;
    }
  }
});
socket.on("createChat", (chatid) => {
  var form = document.getElementById("chatForm");
  form.username.value = User.id;
  form.room.value = chatid;
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
    var nav = document.getElementById("tophead");
    nav.innerHTML += `<div id="menu" onclick="onClickMenu()">
          <div id="bar1" class="bar"></div>
          <div id="bar2" class="bar"></div>
          <div id="bar3" class="bar"></div>
        </div> `;
    // var button = document.getElementById("signinButton");
    // button.innerHTML += `<button id="logout" onclick="logout()">Logout</button>`;
    button2.innerHTML += `<button id="submit" onclick="submitData()">Submit</button>`;
  } else {
    var nav = document.getElementById("tophead");
    nav.innerHTML += `<button id="signinButton" onclick="login()">Login</button> `;

    // var button = document.getElementById("login_status");
    // button.innerHTML = `Login`;
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
    Date: document.getElementById("Day").value,
    Time: document.getElementById("Time").value,
    Nop: document.getElementById("People").value,
    chatid: Date.now() + Math.floor(Math.random() * 100),
  };
  if (data.To != "" && data.From != "" && data.To != data.From) {
    socket.emit("submit_new_data", data);
  }
}

function join_chatgroup(chatid) {
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
    Nop: document.getElementById("People").value,
    chatid: chatid,
  };
  console.log(chatid);

  socket.emit("joinchat", data);
}


