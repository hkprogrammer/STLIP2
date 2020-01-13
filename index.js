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

    //console.log(name,password)
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
    var password = data["password"];
    let passlen = String(password).length;

    password = md5(password)


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
        sql = `INSERT INTO users(username,email,grade,subjects,ID,password,level) VALUES(\"${name}\",\"${email}\",${grade},\"${subject}\",\"${f}\","${password}",3)`
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

            

            res.send({name,grade,email,subject,id,"status":"success", "passlen" : passlen});
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
        let id, sql;
        if(String(username).length <= 5){
            id = Number(username);
            sql = `SELECT username,password,level FROM users WHERE ID=${username}`;
        }
        else{
            sql = `SELECT username,password,level FROM users WHERE username="${username}"`;
        }
        
       
        console.log(sql)
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(rows);
            try{
                let hashPass;
                //let loginCredName;
               
               
                hashPass = md5(password);
                
             
                try{
                    if(rows[0]["password"] == hashPass){
                        console.log(username + " accessed through the system");
                        res.send({"msg": "access", "username" : rows[0]["username"]});
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

    //console.log({username,password})
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

    
    let sql = `INSERT INTO articles(Publisher,Date,Content,Title) VALUES('${publisher}','${date}','${content}','${title}')`;
    db.all(sql, [], (err, rows) => {
        console.log("correctly saved")
    });
    
    
    

 

    console.log({data});
    
    res.send("safe")

});
app.post("/showArticle", (req,res)=>{

    let sql = `SELECT * FROM articles ORDER BY Date DESC`;
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

app.delete("/delArticle", (req,res)=>{

    var data = req.body;
    var title = data["title"];

    let sql = `DELETE FROM articles WHERE Title='${title}'`;
    db.all(sql, [], (err, rows) => {
        res.send("deleted");
    });

});

app.post("/getSessionForPanels",(req,res)=>{

    var data = req.body;
    var username = data["username"];

    let sql = `SELECT username,ID,level FROM users WHERE username='${username}'`
    db.all(sql, [], (err, rows) => {
        //console.log(rows);
        if(rows[0]["level"] >= 3){
            sql = `SELECT date FROM sessions WHERE attendingTutor='${rows[0]["ID"]}'`
        }
        else{
            sql = `SELECT date FROM sessions WHERE attendingStudent='${rows[0]["ID"]}'`
        }
        
        //console.warn(sql)
        db.all(sql, [], (err, rows) => {
           //console.log(rows)
           res.send(rows);
        });
       
    });
});


app.post("/editArticle", (req,res)=>{

    var data = req.body;
    var originalTitle = data["originalTitle"];
    var title = data["title"];
    var content = data["content"];
    var date = data["date"];
    var publisher = data["publisher"];


    let sql = `UPDATE articles SET Publisher="${publisher}",Date="${date}",Title="${title}",content="${content}" WHERE Title="${originalTitle}"`;
    db.all(sql, [], (err, rows) => {
        console.log("sucess")
        res.send("safe");
    });




});
 
app.post("/searchTutor", (req,res)=>{

    var data = req.body;
    var condition = data["condition"];
    var username = data["username"];
    console.log(data)
    let sql = `SELECT * FROM users WHERE Level=3`;
    db.all(sql, [], (err, rows) => {

        let format = [];
        for(let i=0;i<rows.length;i++){
            var person = rows[i];
            var subject = person["subjects"].split(",");
            console.log(subject)
            for(let v=0;v<subject.length;v++){
                if(subject[v] == condition){
                    format.push(person);
                    
                }
            }

        }
        console.log(format)
        res.send(format);

    });




});



app.post("/requestTutor", (req,res)=>{

    var data = req.body;
    var fromUser = data["from"];
    var targetTutor = data["to"];
    var date = data["date"];
    var subject = data["course"]
    let sql = "SELECT requestID FROM requestTutors ORDER BY requestID ASC";
    db.all(sql, [], (err, rows) => {
        //check if the first row exist
        
        let count
        try{
            console.log(rows[0]["requestID"]);
            count = rows.length + 1;
        }
        catch(err){
            console.log(err);
            count = 1;
            
            
        }
        sql = `SELECT ID FROM users WHERE username="${targetTutor}"`;
        db.all(sql, [], (err, rows) => {
            let id = rows[0]["ID"];

            sql = `INSERT INTO requestTutors(requestID,requestFrom,requestTo,requestDate,requestToID,subject) VALUES(${count},"${fromUser}","${targetTutor}","${date}",${id},"${subject }")`
            db.all(sql, [], (err, rows) => {
            
              
                res.send("safe");
    
    
            });
            

        });


       
        
    });


   




    //res.send("safe")



});


app.post("/checkRequestStatus",(req,res)=>{

    var data = req.body;
    var username = data["user"];


    let sql =  `SELECT username,level FROM users WHERE username='${username}'`;
    db.all(sql, [], (err, rows) => {
        let level = rows[0]["level"];

        //tutor handler
        if(Number(level) >= 3 && Number(level) != 5){
            sql = `SELECT * FROM requestTutors WHERE requestTo='${username}' AND valid!=0 AND valid!=2`
            
        }
        //student handler
        else if(Number(level) < 3){
            sql = `SELECT * FROM requestTutors WHERE requestFrom='${username}' AND valid!=0 AND valid!=2`
        }
        //admin handler
        else{
            res.send("Admin Access");
        }


        db.all(sql, [], (err, rows) => {
            

            console.log(rows)
            res.send(rows);


        });



    });


});

app.post("/loadRequestDetails",(req,res)=>{

    var data = req.body;
    var id = data["requestID"];

    let sql = `SELECT * FROM requestTutors WHERE requestID=${id}`
    db.all(sql, [], (err, rows) => {
        var d = {
            "requestData" : rows[0]
        };
        let studentName = rows[0]["requestFrom"];
        let tutorName = rows[0]["requestTo"];
        //fetch Students information
        sql = `SELECT username,email,grade FROM users WHERE username="${studentName}"`;
        db.all(sql, [], (err, rows) => {
            d["studentInfo"] = rows[0];


            //fetch Tutor information
            sql = `SELECT username,email,grade,subjects,ID FROM users WHERE username="${tutorName}"`;
            db.all(sql, [], (err, rows) => {
               d["tutorInfo"] = rows[0];
               console.log(d);
               res.send(d)
            });
        });


    });

});

app.post("/cancelRequest", (req,res)=>{

    var data = req.body;
    var username = data["name"];
    var requestID = data["requestID"];

    let sql = `UPDATE requestTutors SET valid=0 WHERE requestID=${requestID}`;
    db.all(sql, [], (err, rows) => {
        console.log("canceled");
        res.send("safe");

    });

});

app.post("/acceptRequest", (req,res)=>{

    var data = req.body;
    var username = data["name"];
    var requestID = data["requestID"];
    var date = data["date"];


    let sql = `UPDATE requestTutors SET valid=2 WHERE requestID=${requestID}`;
    db.all(sql, [], (err, rows) => {
        
        sql=`SELECT * FROM requestTutors WHERE requestID=${requestID}`;
        db.all(sql, [], (err, rows) => {
            var requestInfo = rows[0];
            sql=`SELECT * FROM pariedRoom`;
            db.all(sql, [], (err, rows) => {
                let id;
                try{
                    console.log(rows.length);
                    id = rows.length + 1;
                
                }
                catch(err){
                    id = 1;
                    console.log(err);
                }
               
            
                if(requestInfo["requestTo"] == username){

                    sql = `SELECT ID FROM users WHERE username="${username}"`
                    db.all(sql, [], (err, rows) => {
                        console.log("safe");
                        sql =  `INSERT INTO pairedRoom(pairedTutor,pairedStudent,pairID,pairDate,pairSubject,tutorID) VALUES("${requestInfo["requestTo"]}","${requestInfo["requestFrom"]}","${id}","${date}","${requestInfo["subject"]}",${rows[0]["ID"]})`
                        db.all(sql, [], (err, rows) => {
                            console.log("safe");
                            res.send("safe");
                        });
                    });


                   
                
                }
                else{
                    res.send("Empty")
                }


            });


            
        
        
        });  

    });



});


app.post("/loadPrivateSessions",(req,res)=>{
    console.log("asd")
    let data = req.body;
    let username = data["username"];

    //let sql = `SELECT * FROM pariedRoom WHERE pairedStudent`

    let sql = `SELECT level,username FROM users WHERE username="${username}"`;
    db.all(sql, [], (err, rows) => {
        let person = rows[0];
        if(Number(person["level"]) < 3){
            sql = `SELECT * FROM pairedRoom WHERE pairedStudent="${person["username"]}"`
        }
        else if(Number(person["level"]) >= 3 && Number(person["level"] < 5)){
            sql = `SELECT * FROM pairedRoom WHERE pairedTutor="${person["username"]}"`
        }
        
        db.all(sql, [], (err, rows) => {
            console.log(rows);
            res.send(rows);
        });
    });

});

app.post("/loadRoomDetails", (req,res)=>{

    var data = req.body;
    var roomID = data["roomID"];
    let sql = `SELECT * FROM pairedRoom WHERE pairID=${roomID}`
    db.all(sql, [], (err, rows) => {
        var d = {
            "roomData" : rows[0]
        };
        let studentName = rows[0]["pairedStudent"];
        let tutorName = rows[0]["pairedTutor"];
        //fetch Students information
        sql = `SELECT username,email,grade FROM users WHERE username="${studentName}"`;
        db.all(sql, [], (err, rows) => {
            d["studentInfo"] = rows[0];


            //fetch Tutor information
            sql = `SELECT username,email,grade,subjects,ID FROM users WHERE username="${tutorName}"`;
            db.all(sql, [], (err, rows) => {
               d["tutorInfo"] = rows[0];
               console.log(d);
               res.send(d)
            });
        });


    });
   
});

app.post("/loadPrivateSessionDate",(req,res)=>{

    var data = (req.body)["roomID"];
    
    let sql = `SELECT date FROM pairedRoomDatesCollector WHERE roomID=${data}`;
    console.log(sql)
    db.all(sql, [], (err, rows) => {
        console.log(rows)
        let format = [];
        for(var i = 0;i<rows.length;i++){
            format.push(rows[i]["date"]);
        }
        format = removeDups(format);

        res.send(format);
    });



});

app.post("/submitDates", (req,res)=>{
    var dates = ((req.body)["dates"]).split(",");
    
    let format = "";
    for(let i=0; i<dates.length;i++){
        if(i == (dates.length -1)){
            format += dates[i]
        }
        else{
            format += dates[i] + ",";
        }
       
    }
    
    let sql = `INSERT INTO `




})

/**
 * db.all(sql, [], (err, rows) => {
        throw err;
    });
 * 
 */