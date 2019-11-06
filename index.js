var express = require("express");
var app = express();
var path = require('path');
//SQLite3 initialization
var db;
const sqlite3 = require("sqlite3").verbose();

startupDB();
function startupDB(){
    
    db = new sqlite3.Database('/dbs/main.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });
}


app.use(express.urlencoded())
const port = 3000;

var server = app.listen(port, listening);

app.use(express.static('src'))

function listening(){
    console.log("App runing on port", port);
}

app.post("/check", (req,res) => {
    let name = req.body.name;
    let age = req.body.age;
    console.log(req.body)
    res.send("Your age is " + age + " and your name is " + name);

});

app.get("/startup/:password", (req,res)=>{
    let password = req.password;
    if(password == "123"){
        startupDB();
    }
    console.log("DB Started")
    res.send("DB Started");
});

app.get("/shutdown/:password", (req,res)=>{
    
   var password = req.password;


    if(password == "123"){
        db.close()
    }
    console.log("DB closed")
    res.send("Database Closed");
});
