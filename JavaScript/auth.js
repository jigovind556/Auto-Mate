// const Server = "http://43.205.206.153:3001";
const Server = "http://127.0.0.1:3001";

checkCookie();

function checkCookie() {
  var user = accessCookie("user");
  if (user != "") {
    window.location.href = "index.html";
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

function validatePassword(data) {
  var pass = document.getElementById("password").value;
  // console.log(data.password  ,pass1);  //test code
  if (data.password == pass) {
    return true;
  } else {
    return false;
  }
}

function validateUser() {
  var Server2 = Server + "/getUser"; //modifying link if server
  // fetching data of user from server

  axios
    .post(Server2, {
      email: document.getElementById("email").value,
    })
    .then((response) => {
      console.log(response.data.length > 0);
      if (response.data.length > 0) {
        // user exist
        // checking credential
        var user = {
          id: response.data[0].Email,
          name: response.data[0].name,
          password: response.data[0].Password,
        };
        var userInfo = {
          id: user.id,
          name: user.name,
        };

        if (validatePassword(user)) {
          //valid user so redirecting to home page
          // alert("correct password");
          // localStorage.setItem("user",JSON.stringify(userInfo));
          var date = new Date();
          date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
          document.cookie =
            `user=` +
            JSON.stringify(userInfo) +
            `; expires=` +
            date.toGMTString();
          window.location.href = "index.html";

          //   props.Specifystate({ login: true, credential: user, formState: 0 });
        } else {
          // wrong password
          alert("Wrong Password");
        }
      } else {
        //user does not exist
        alert("user does not exist");
      }
    })
    .catch((err) => {
      console.log(err);
      alert("some error occured");
    });
}
