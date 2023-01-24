let User;
checkCookie();

const place = ["NIT Kurukshetra", "Brahma Sarovar", "Railway Station", 
"Pipli Bus Stand", "Jyotisar", "Kessel Mall", "Divine Mall", "Carnivel Cinema", 
"Shrikrishna Museum" , "Seikh Chilli Tomb" , "Sector 17" , "New Bus Stand"
]

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

getHistory();

function getHistory() {
    console.log("hello");
    var Server2 = Server + "/thistory";
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
            appendHistory(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
}

function appendHistory(data) {
    var hist = document.getElementById("history");
    for (let i = 0; i < data.length; i++) {
        var anyDate = data[i].date;
        // var date2 = anyDate.replace(/[-]/g, '/').replace('T', ' ').replace('Z', '');
        // date2 = Date.parse(date2);
        // date2 = new Date(date2);
        // date2 = date2.toShortFormat();
        var date2=dateformat(anyDate);
        var img= place.indexOf(data[i].dest);
       
        hist.innerHTML +=
            `<div class="ride">
    <div class="sidebar">
      <div>
        <img src="IMG/Location.png" alt="*" width="50px" height="55px" />
      </div>
      <hr />
      <br /><br />
      <hr />
      <br /><br />
      <hr />
    </div>
    <div class="details">
      <h4>` +
            data[i].dest +
            `</h4>
      <p>📆 `+ date2 + `</p>
      <p>🕰️ `+ data[i].travel_Time.slice(0, 5) + `</p>
      <p>From ` +
            data[i].jstart +
            `</p>
    </div>
    <div id="bustop">
      <img src="IMG/`+img+`.png" alt="img" width="140px" height="150px" />
    </div>
  </div>
  <br />`;
    }
}


// Date.prototype.toShortFormat = function () {

//     const monthNames = ["Jan", "Feb", "Mar", "Apr",
//         "May", "Jun", "Jul", "Aug",
//         "Sep", "Oct", "Nov", "Dec"];

//     const day = this.getDate();

//     const monthIndex = this.getMonth();
//     const monthName = monthNames[monthIndex];

//     const year = this.getFullYear();

//     var yr = JSON.stringify(year);
//     yr = yr.slice(2, 4);
//     yr = Number(yr);
//     return `${day}-${monthName}-${yr}`;
// }

function dateformat(date){
    var d=JSON.stringify(date);
    d2=d.slice(1,8)+d.slice(10,12);
    return d2;
}