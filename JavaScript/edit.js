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

function edit_detail() {
    var Server2=Server +"/updtuser";
  var data = {
    email: User.id,
    name: document.getElementById("name").value,
    Mob: document.getElementById("Mobile_no").value,
  };
  if (data.name != "" || data.Mob != "") {
    if (ValidateMobile_no(data.Mob)) {
        axios
        .post(Server2, data)
        .then((res) => {
            if(res.data=="success"){
                alert("Details updated successfully");
                window.location.href="myaccount.html";
            }
            else{
                alert("some error occured");
            }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  else{
    alert("fill the details");
  }
}

function ValidateMobile_no(inputText) {
  if (inputText.length == 10 || inputText.length == 0) {
    return true;
  } else {
    alert("mobile no should be 10 digit"); //The pop up alert for an invalid email address
    //   document.form1.text1.focus();

    return false;
  }
}
