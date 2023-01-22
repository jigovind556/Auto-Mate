let User;
checkCookie();

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

function changepwd() {
  var OldPwd = document.getElementById("OldPwd").value;
  var NewPwd = document.getElementById("NewPwd").value;
  var RePwd = document.getElementById("RePwd").value;


  if (validatePassword(NewPwd, RePwd)) {
    var Server2 = Server + "/changepwd";
    var data = {
      email: User.id,
      OldPwd:OldPwd,
      NewPwd:NewPwd
    };
    axios
      .post(Server2, data)
      .then((res) => {
        console.log(res.data);
        if(res.data=="nomatch"){
            setAlert("Old Password is not correct");
        }
        else if(res.data=="updated"){
            alert("Password changed Successfully");
            window.location.href="myaccount.html";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function validatePassword(p1, p2) {
    if (p1 == p2) {
        if (p1.length > 6) {
        return true;
        } else {
        alert("password should be more than 6 characters"); //The pop up alert for an invalid email address
        //   document.form1.text1.focus();

        return false;
        }
    }
    else{
        setAlert(`Password Not Match`);
        return false;
    }
}

function setAlert(txt){
    const alert_popup = document.getElementById('alert');
        alert_popup.innerHTML = txt;
        alert_popup.style.visibility = 'visible';
        setTimeout(() => {
            alert_popup.style.display = 'none';
          }, 2000);
}
