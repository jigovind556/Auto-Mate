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

function submit_detail() {
  var Server2 = Server + "/createuser";
  var data = {
    name: document.getElementById("name").value,
    Email: document.getElementById("Email").value,
    Mobile_no: document.getElementById("Mobile_no").value,
    Password: document.getElementById("Password").value,
  };
  // console.log(data);
  if (ValidateForm(data)) {
    console.log("sucess");

    axios
      .post(Server2, data)
      .then((res) => {
        console.log("success");
        alert("Your account has been created");
        var userInfo = {
          id: data.Email,
          name: data.name,
        };
        // localStorage.setItem("user",JSON.stringify(userInfo));
        var date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie =
          `user=` +
          JSON.stringify(userInfo) +
          `; expires=` +
          date.toGMTString();
        window.location.href = "index.html";
      })
      .catch((err) => {
        console.log("Username already used Choose a different username");
        alert("Username already used Choose a different username");
      });
  }
}

function ValidateForm(data) {
  console.log(data);

  if (
    ValidateName(data.name) &&
    ValidateEmail(data.Email) &&
    ValidateMobile_no(data.Mobile_no) &&
    validatePassword(data.Password)
  ) {
    return true;
  } else {
    return false;
  }
}

function ValidateName(inputText) {
  if (inputText.length > 0) {
    return true;
  } else {
    alert("Name can't be blank"); //The pop up alert for an invalid email address
    //   document.form1.text1.focus();

    return false;
  }
}

function ValidateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@nitkkr.ac.in/;
  //   console.log(inputText);
  //   if (inputText.match(mailformat)) {
  if (mailformat.test(inputText)) {
    //   document.getElementById("email_input").focus();
    return true;
  } else {
    alert("write correct domain id of NIT kurukshetra!"); //The pop up alert for an invalid email address
    //   document.form1.text1.focus();

    return false;
  }
}

function validatePassword(inputText) {
  if (inputText.length > 6) {
    return true;
  } else {
    alert("password should be more than 6 characters"); //The pop up alert for an invalid email address
    //   document.form1.text1.focus();

    return false;
  }
}

function ValidateMobile_no(inputText) {
  if (inputText.length == 10) {
    return true;
  } else {
    alert("mobile no should be 10 digit"); //The pop up alert for an invalid email address
    //   document.form1.text1.focus();

    return false;
  }
}
