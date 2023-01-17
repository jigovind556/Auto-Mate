const Server = "http://127.0.0.1:3001";
const Server2=Server+"/chat";
var socket = io(Server2);
  
checkCookie();

function checkCookie() {
  var user = accessCookie("user");
  if (user != "") {
    var button=document.getElementById("signinButton");
    button.innerHTML= `<button id="logout" onclick="logout()">Logout</button>`;
  }
  else{
    var button=document.getElementById("signinButton");
    button.innerHTML= `<button id="login" onclick="login()">Login</button>`;

  }
}
function accessCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function logout(){
    document.cookie = "user=''; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    window.location.href="index.html";
}
function login(){
    window.location.href="signin.html";
}