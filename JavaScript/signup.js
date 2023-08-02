// const Server = "http://43.205.206.153:3001";
// const Server = "http://127.0.0.1:3001";
checkCookie();

var grape;
var isverified = 0;
var loading = 0;

function checkCookie() {
  var user = accessCookie("user");
  if (user != "") {
    window.location.href = "index.html";
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

// add event listener to signupButton
var signUpBtn = document.querySelector("#signupButton");
signUpBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  var data = {
    name: document.getElementById("name").value,
    Email: document.getElementById("Email").value,
    Mobile_no: document.getElementById("Mobile_no").value,
    // Password: document.getElementById("Password").value,
  };
  // //console.log(data);
  if (ValidateForm(data)) {
    if (isverified === 0) {
      sendOTP();
    } else if (isverified === 1) {
      verifyOTP();
    } else {
      submit_detail();
    }
  }
});

function submit_detail() {
  var Server2 = Server + "/createuser";
  var data = {
    name: document.getElementById("name").value,
    Email: document.getElementById("Email").value,
    Mobile_no: document.getElementById("Mobile_no").value,
    Password: document.getElementById("Password").value,
  };
  // //console.log(data);
  if (ValidateForm(data) && validatePassword(data.Password)) {
    //console.log("sucess");

    axios
      .post(Server2, data)
      .then((res) => {
        //console.log("success");
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
        //console.log("Username already used Choose a different username");
        alert("Username already used Choose a different username");
      });
  }
}

function sendOTP() {
  if (loading == 0) {
    loading = 1;
    document.getElementById("signupButton").innerText = "Sending OTP ....";
    var data = {
      email: document.getElementById("Email").value,
    };
    var Server2 = Server + "/sendotp";

    axios
      .post(Server2, data)
      .then((res) => {
        //console.log("OTP sent on email");
        alert("OTP sent successfully \nPlese check your email.");
        grape = res.data;
        document.getElementById("changinglabel").style.display = "block";
        document.getElementById("changinglabel").innerText = "Enter OTP";
        document.getElementById("signupButton").innerText = "Verify OTP";
        document.getElementById("Password").style.display = "block";
        document.getElementById("Password").ariaPlaceholder = "Enter OTP";
        isverified = 1;
        loading = 0;
      })
      .catch((err) => {
        //console.log(err);
        alert("Server Error");
      });
  }
}

function verifyOTP() {
  var otp = String(document.getElementById("Password").value);
  if (otp != "") {
    //console.log("comparing");
    //console.log(grape);
    //console.log(otp);
    if (String(grape) === otp) {
      // document.getElementById('changinglabel').style.display="block";
      document.getElementById("changinglabel").innerText = "Enter Password";
      // document.getElementById('password').style.display="block";
      // document.getElementById("Password").ariaPlaceholder = "Password";
      document.getElementById("Password").value = "";
      alert("OTP verified \nPlease Create a Password");
      document.getElementById("signupButton").innerText = "Signup";
      isverified = 2;
    } else {
      //console.log("Wrong otp");
    }
  }
}

function ValidateForm(data) {
  //console.log(data);

  if (
    ValidateName(data.name) &&
    ValidateEmail(data.Email) &&
    ValidateMobile_no(data.Mobile_no)
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
  //   //console.log(inputText);
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
