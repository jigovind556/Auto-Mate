const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "1989",
  database: "auto_mate",
  multipleStatements: true,
});

app.post("/getUser", (req, res) => {
  try {
    var email = req.body.email;

    console.log(email);
    db.query("select * from user where email =?;", [email], (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        res.status(102).send(new Error(err.sqlMessage));
      } else {
        console.log(result);
        res.send(result);
      }
    });
  } catch (error) {
    console.log("wrong user");
    res.status(102).send(new Error("data should not be blank"));
  }
});

//this function is to create account
app.post("/createuser", (req, res) => {
  try {
    var name = req.body.name;
    var Email = req.body.Email;
    var Mobile_no = req.body.Mobile_no;
    var Password = req.body.Password;

    db.query(
      "insert into user (email,name,password,Mobile_no) values(?,?,?,?);",
      [Email, name, Password, Mobile_no],
      (err, result) => {
        if (err) {
          console.log(err.sqlMessage);
          res.status(102).send(new Error(err.sqlMessage));
        } else {
          res.send("success");
        }
      }
    );
  } catch (error) {
    console.log("wrong user");
    res.status(102).send(new Error("data should not be blank"));
  }
});

app.listen(3001, () => {
  console.log("started successfully");
});
