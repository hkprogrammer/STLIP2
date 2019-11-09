var express = require("express");
var app = express();
var path = require('path');
//SQLite3 initialization
var db;
const sqlite3 = require("sqlite3");



startupDB();
function startupDB(){
    
    db = new sqlite3.Database('dbs/main.db', (err) => {
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
app.get("/checkTutors", (req,res)=>{

    let sql = "SELECT * FROM users ORDER BY ID ASC"
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        for(let i = 0;i<rows.length;i++){
            if(rows[i]["level"] >= 4){
                rows.splice(i,1);
            }
        }
        res.send(rows);
        //console.log(rows);    
    
    
    });


});

app.post("/login",(req,res)=>{

    let data = req.body;
    let name = String(data.username);
    let password = String(data.password);

    console.log(name,password)
    var access = false;
    let sql = `SELECT * FROM users`;
    var msg = "";
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        for(let i = 0; i < rows.length; i++){
            
            if(rows[i]["username"] == name){
                
                if(rows[i]["password"] == password){
                    
                    if(Number(rows[i]["level"]) >= 4){
                        access = true;
                        console.log("access");
                        break
                    }
                    else if(Number(rows[i]["level"]) < 4){
                        access = false;
                        msg = "level"
                        console.log("Not admin")
                        break
                    }
                   
                }
            }
        }
        if(msg == ""){
            res.send(access);
        }
        else{
            res.send(msg);
        }
       
        
    
    });
    
});

app.post("/addTutor", (req,res)=>{
    var data = req.body;
    var name = String(data.name);
    var grade = data.grade;
    var email = data.email;
    var subject = data.subject;
    
    let sql = `SELECT count FROM IDs`
    var c;
    var f;
    var id;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        console.log(rows[0]["count"]);
        c = Number(rows[0]["count"]);
        
        f = c + 1
        sql = `UPDATE IDs SET count=${f} WHERE count=${c}`
        db.run(sql, function(err) {
            if (err) {
            return console.log(err.message);
            }
            // get the last insert id
           
        });
        sql = `INSERT INTO users(username,email,grade,subjects,ID,password,level) VALUES(\"${name}\",\"${email}\",${grade},\"${subject}\",\"${f}\","StudyBuddies2019",3)`
        console.log(sql);
        db.run(sql, function(err) {
            if (err) {
            return console.log(err.message);
            }
            id = f;
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            console.log("Adding Student " + name);
            console.log({name,grade,email,subject,id,"status":"success"});
            res.send({name,grade,email,subject,id,"status":"success"});
        });
    });
    
    

    
    


    
    
});

app.delete("/delTutor",(req,res)=>{

    var data = req.body;
    var name = data.name;
    console.log(data);
    
    if(name != "admin"){
        let sql = `DELETE FROM users WHERE username=${name}`
        console.log(sql)
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }

            //edit IDs
            sql = `SELECT count FROM IDs`
            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                
                let number = Number(rows[0]["count"]);
                let final = number - 1;
                if(final < 0){
                    //no operations
                    console.log("count negative")
                    res.send("Invalid Operation, Negative Count. Contact Administrator");
                }
                else if(final >= 0){
                    sql = `UPDATE IDs SET count=${final} WHERE count=${number}`;
                    db.all(sql, [], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        
                        res.send("successfully deleted user");
                        
                    
                    });
                }
                
            
            });

        
        
    
        });
    }
    
  
    

    

});

app.post("/renameTutor",(req,res)=>{
    var data = req.body;
    var name = data.name;
    var newname = data.newname;

    let sql=`UPDATE users SET username=${newname} WHERE username=${name}`;
    console.log(sql)
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        res.send("Updated name to " + newname);
        
    
    });

});


/**
 * db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    
    
    

});
 * 
 */