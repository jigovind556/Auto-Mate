let User;
checkCookie();

function checkCookie() {
  var user = accessCookie("user");
  if (user == "") {
    window.location.href = "index.html";
  } else {
    User = JSON.parse(user);
    // console.log(User.id);
    setData();
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

function setData() {
  document.getElementById("email").innerHTML = User.id;
  var Server2 = Server + "/getcred";
  var data = {
    email: User.id,
  };
  axios
    .post(Server2, data)
    .then((res) => {
      console.log(res.data);
      var info=res.data[0];
      document.getElementById("fname").innerHTML=info.name;
      document.getElementById("mob").innerHTML=info.Mobile_no;
    })
    .catch((err) => {
      console.log(err);
    });
}
