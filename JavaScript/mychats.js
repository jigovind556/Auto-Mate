let User;
checkCookie();

const place = [
  "NIT Kurukshetra",
  "Brahma Sarovar",
  "Railway Station",
  "Pipli Bus Stand",
  "Jyotisar",
  "Kessel Mall",
  "Divine Mall",
  "Carnivel Cinema",
  "Shrikrishna Museum",
  "Seikh Chilli Tomb",
  "Sector 17",
  "New Bus Stand",
];

function checkCookie() {
  var user = accessCookie("user");
  if (user == "") {
    window.location.href = "index.html";
  } else {
    User = JSON.parse(user);
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

activechat();

function activechat() {
  console.log("hello");
  var Server2 = Server + "/activechat";
  var d = new Date();
  var date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  var data = {
    email: User.id,
    time: d.getHours() + ":" + d.getMinutes(),
    date: date,
  };

  axios
    .post(Server2, data)
    .then((res) => {
      console.log(res.data);
      appendchat(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function appendchat(data) {
  var chat = document.getElementById("chats");
  for (let i = 0; i < data.length; i++) {
    var anyDate = data[i].date;
    var date2 = dateformat(anyDate);
    chat.innerHTML +=
      `<div class="chat">
        <div id="grpicon">
          <img src="IMG/grpicon.png" height="50px" width="50px" />
        </div>
        <div class="container1">
        <div class="grpinfo" onclick="enterchat('` +
      data[i].chatRoom_id +
      `')">
          <h3 id="grpname">`+data[i].room_name+`</h3>
          <p class="loc">
            To<img src="IMG/locpin.png" height="20px" width="20px" />: ` +
      data[i].dest +
      `
          </p>
          <p class="loc">From : ` +
      data[i].jstart +
      `</p>
          <i class="fa-solid fa-car"> ` +
      data[i].pwy +
      `</i>
          <p class="loc">Time : ` +
      data[i].travel_Time.slice(0, 5) +
      `</p> 
          <p class="loc">Date : ` +
      date2 +
      `</p> 
      </div>
      <button onclick="deleteChat('` +
  data[i].chatRoom_id +
  `','`+data[i].pwy+`')">Delete Chat</button>
  </div>
        <div id="number">
          <i class="fa-solid fa-users"> ` +
      data[i].No_of_person +
      `</i>
        </div>
      </div>
      <br />`;
  }
}

function dateformat(date) {
  var d = JSON.stringify(date);
  d2 = d.slice(1, 8) + d.slice(10, 12);
  return d2;
}

function enterchat(chatid) {
  var form = document.getElementById("chatForm");
  form.username.value = User.id;
  form.room.value = chatid;
  form.submit();
}

function deleteChat(chatid,pwy) {
  var Server2 = Server + "/deletechat";
  var data = {
    email: User.id,
    chatid: chatid,
    pwy:pwy
  };

  axios
    .post(Server2, data)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
