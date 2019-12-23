var express = require("express");
var app = express();
var path = require('path');
//SQLite3 initialization
var db;
const sqlite3 = require("sqlite3");

//hashes
var md5= require("md5")

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
//const port = 3000;
const port = 80;
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

app.post("/adminLogin",(req,res)=>{

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
        
        //console.log(rows[0]["count"]);
        c = Number(rows[0]["count"]);
        
        f = c + 1
        sql = `UPDATE IDs SET count=${f} WHERE count=${c}`
        db.run(sql, function(err) {
            if (err) {
                console.log(err.message);
            }
            // get the last insert id
           
        });
        sql = `INSERT INTO users(username,email,grade,subjects,ID,password,level) VALUES(\"${name}\",\"${email}\",${grade},\"${subject}\",\"${f}\","StudyBuddies2019",3)`
        //console.log(sql);
        db.run(sql, function(err) {
            if (err) {
                console.log(err.message);
            }
            id = f;
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
            //console.log("Adding Student " + name);
            //console.log({name,grade,email,subject,id,"status":"success"});
            res.send({name,grade,email,subject,id,"status":"success"});
        });
    });
    
    

    
    


    
    
});

app.delete("/delTutor",(req,res)=>{

    var data = req.body;
    var name = data.name;
    //console.log(data);
    
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
                    //console.log("count negative")
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
    //console.log(sql)
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        res.send("Updated name to " + newname);
        
    
    });

});
app.post("/signupsession",(req,res)=>{
    let data = req.body;
    let name = data.username;
    let date = data.date;

    let sql = `SELECT * FROM users WHERE username=\"${name}\"`
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        var occurance = false;
        var dateOccurance = false;
        sql = `SELECT ID FROM users WHERE username=\"${name}\"`
        let id;
        let person = rows[0];
        db.all(sql, (err,rows)=>{
            if(err){throw err}
            id = rows[0]["ID"]
            sql = "SELECT * FROM sessions"
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                //console.log(rows);
                for(let i=0; i<rows.length;i++){
                    if(rows[i]["date"] == date){
                        //console.log("date")
                        dateOccurance = true;
                        if(rows[i]["attendingStudent"] == id || rows[i]["attendingTutor"] == id){
                            occurance = true;
                            
                            //console.log(occurance)
                            break
                        }
                        
                    }
                    
                    
                }
                
                if(person["level"] == 3){
                    
                    //create session as tutor

                    if(!occurance){
                        sql = `INSERT INTO sessions(date,attendingTutor,warning) VALUES("${date}",${person["ID"]},0)`
                        db.all(sql, [], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            
                            //console.log(occurance)
                            res.send("Inserted");
                        
                        });
                    }
                    else{
                        res.send("Date Conflict")
                    }
                    
                    
                }
                else if(person["level"] < 3){
                    //create session as student
                    if(!occurance){
                        sql = `INSERT INTO sessions(date,attendingStudent,warning) VALUES("${date}",${person["ID"]},0)`
                        db.all(sql, [], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            
                            //console.log(occurance)
                            res.send("Inserted");
                        
                        });
                    }
                    else{
                        res.send("Date Conflict")
                    }
                }
                else{
                    console.log("Invalid User Signup", {name,date,person})
                    res.send("Invalid User")
                }

                        
                        
                    
            });
        });
        
        
        
        
    });



});

app.post("/loadTutors",(req,res)=>{

    var data = req.body;
    var date = data.date;
    
    let sql = `SELECT * FROM sessions WHERE date=\"${date}\"`
    //console.log(sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        var u = [];
        for(let i=0;i<rows.length;i++){
            if(rows[i]["attendingTutor"] != null){
                u.push(rows[i]["attendingTutor"])
            }
        }

        //console.log(u)

        
        sql = `SELECT username,grade,subjects,ID FROM users`
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            var f = [];
            //console.log(rows);
            //console.log(rows[0]["ID"]);
            for(let i=0;i<rows.length;i++){
                for(let s=0;s<u.length;s++){
    
                    if(rows[i]["ID"] == u[s] && rows[i]["ID"] != null){
                        f.push({
                            "name": rows[i]["username"],
                            "grade": rows[i]["grade"],
                            "subjects": rows[i]["subjects"],
                            "id": u[s]
                        });
                        
                        break
                    }
                   
                }
            }

            //console.log(f);
            res.send(f)
            
        
        });
        
    
    });



});
app.post("/loadStudents",(req,res)=>{

    var data = req.body;
    var date = data.date;
    
    let sql = `SELECT * FROM sessions WHERE date=\"${date}\"`
    //console.log(sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        var u = [];
        for(let i=0;i<rows.length;i++){
            if(rows[i]["attendingStudent"] != null){
                u.push(rows[i]["attendingStudent"])
            }
        }

        //console.log(u)

        
        sql = `SELECT username,grade,ID FROM users`
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            var f = [];
            //console.log(rows);
            //console.log(rows[0]["ID"]);
            for(let i=0;i<rows.length;i++){
                for(let s=0;s<u.length;s++){
    
                    if(rows[i]["ID"] == u[s] && rows[i]["ID"] != null){
                        f.push({
                            "name": rows[i]["username"],
                            "grade": rows[i]["grade"],
                            "id": u[s]
                        });
                        
                        break
                    }
                   
                }
            }

            //console.log(f);
            res.send(f)
            
        
        });
        
    
    });



});
app.get("/loadSessionsDates",(req,res)=>{
    
    let sql = `SELECT date FROM sessions`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        var list = [];
        for(i=0;i<rows.length;i++){
            list.push(rows[i]["date"]);
        }

        var dupList = removeDups(list);
        //console.log(dupList);
         
        res.send(dupList)
    
    });


});


app.delete("/deleteUsrFromSession",(req,res)=>{
    var data = req.body;
    var name = data.username;
    var date = data.date;
    let sql = `SELECT username,ID,level FROM users WHERE username=\"${name}\"`
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        var o = rows;
        var id = rows[0]["ID"];
        let lvl = rows[0]["level"];
        if(Number(lvl) >= 3){
            sql = `DELETE FROM sessions WHERE attendingTutor=\"${id}\" AND date="${date}"`
        }
        else{
            sql = `DELETE FROM sessions WHERE attendingStudent=\"${id}\" AND date="${date}"`
        }
        console.log(sql)
        console.log(rows);
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log("removed row")
            res.send("Successfully deleted user from session")
            
            
        
        });

        
        
    
    });


});



function removeDups(item) {
  let unique = {};
  item.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

app.post("/loginStudent", (req,res)=>{
    let data = req.body;
    let username = data.username;
    let password = data.password;

    if(username != "" &&  password != ""){
        let sql = `SELECT password,level FROM users WHERE username=\'${username}\'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            try{
                let hashPass;
                if(rows[0]["level"] >= 3){
                    hashPass = password;
                }
                else if(rows[0]["level"] <3){
                    hashPass = md5(password);
                }
                else{
                    hashPass = password;
                }
                try{
                    if(rows[0]["password"] == hashPass){
                        console.log(username + " accessed through the system");
                        res.send("access");
                    }
                    else{
                        console.log("access denied");
                        res.send("access denied")
                    }
                }
                catch(err){
                    console.log(err)
                    console.log("access denied");
                    res.send("access denied")
                }
            }
            catch(err){
                console.log(err)
                console.log("access denied");
                res.send("access denied")
            }
           
            
            
            
        
        });
    }

    console.log({username,password})
    //res.send({username,password})

});
app.post("/register", (req,res)=>{

    let data = req.body;
    let name = data.username;
    let p = data.password;
    let email = data.email;
    let grade = data.grade;

    let password = md5(p);
    let id = 0;

    let sql = `SELECT username FROM users`

    let c = false;
    try{
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            for(i=0;i<rows.length;i++){
                if(rows[i]["username"] == name){
                    //conflict
                    c = true;
                }
            }
            if(!c){
                //getIDs
                sql = `SELECT count FROM IDs`
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    
                    id = rows[0]["count"] + 1;
                    //update users table
                    sql = `INSERT INTO users(username,password,email,grade,ID,level) VALUES(\"${name}\",\"${password}\",\"${email}\",${grade},${id},1) `
                    console.log(sql)
                    db.all(sql, [], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        
                        console.log("updated");
                        let oid= id-1;
                        sql = `UPDATE IDs SET count=${id} WHERE count=${oid}`
                        //update IDs 
                        db.all(sql, [], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            console.log("fully updated")
                            res.send("user uploaded")
                            
                        
                        });
                
                    });
                    
                
                });
            }
            else{
                //conflict
                console.log("conflict, user already existed")
                res.send("conflict")
            }
            
            
        
        });
    }
    catch(err){
        console.log(err);
        res.send("Invalid Register")
    }


    
    


     



});

//Articles

app.post("/publishArticle",(req,res)=>{
    var data = req.body;
    var publisher = data["publisher"];
    var date = data["date"];
    var title = data["title"];
    var content = data["content"];

    
    let sql = `INSERT INTO articles(Publisher,Date,Content,Title) VALUES('${publisher}','${date}','${title}','${content}')`;
    db.all(sql, [], (err, rows) => {
        console.log("correctly saved")
    });
    
    
    

 

    console.log({data});
    
    res.send("safe")

});
app.post("/showArticle", (req,res)=>{

    let sql = `SELECT * FROM articles`;
    db.all(sql,[],(err,rows)=>{

        res.send(rows);


    });


})
app.post("/checkLevel", (req,res)=>{

    var datas = req.body;
    var username = datas["user"];

    let sql = `SELECT username,level FROM users WHERE username='${username}'`;
    db.all(sql, [], (err, rows) => {
        console.log(rows)
        if(rows[0]["level"] >= 3){
            
            res.send("true");
        }
        else{
            res.send("false");

        }

    });

});

 
/**
 * db.all(sql, [], (err, rows) => {
        throw err;
    });
 * 
 */