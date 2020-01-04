const p = `<div class="box" id="newpost">
<div class="container">
    
    <div class="row">
        <div class="col-9">
            <h3>Create New Post</h3>
        </div>
        <div class="col-3">
            <i style="font-size:15px">Posted by: <span id="postby"></span></i>
            <script>document.getElementById("postby").innerHTML = localStorage.getItem("username")</script>
        </div>
    </div>
   
    <br>
    <input type="text" style="width: 50%;" placeholder="title" id="title">
    <br>
    <br>
    <textarea style="width:80%; min-height: 400px;" placeholder="content" id="content"></textarea>
    <!---
        <span>You are a peer tutor, please sign-up a session in your calendar menu</span>

    -->
    <br>
    <br>
    <div class="row">
        <div class="col-9">
            <!--Cancel-->
            <a href="" class="btn btn-sm btn-danger">Cancel</a>
        </div>
        <div class="col-3">
            <!--Submit-->
            <a class="btn btn-sm btn-info" onclick="publish()">Publish</a>
        </div>
    </div>
</div> 

</div> `;

const articleBox = `<div class="box" id="welcome">
<div class="container">
    
    <h3>Welcome to Study Buddies!</h3>
    <br>
    <h5>Follow the tutorial  <a href="tutorial.html">here</a></h5>
    <!---
        <span>You are a peer tutor, please sign-up a session in your calendar menu</span>

    -->
    
</div> 

</div>`

const articleBoxAdmin = `<div class="box" >
<div class="container">
    
   <div class="row">
       <div class="col-10">
            <h1></h1>
       </div>
       <div class="col-2"> 
            <span><i>Published by: </i></span>
       </div>

   </div>
   <sub></sub>
   <hr>
   <div class="container">
        <!--Content-->
        
   </div>
   <div class="row">
        <div class="col-10">
        </div>
        <div class="col-2"><a class="btn btn-sm btn-danger">Delete</a></div>
   </div>
   <br>
    
</div> 

</div>`

const detailsessions = ` <tr>
<th class="date" width="70%"></th>
<td class="day"></td>
<td><a class="btn btn-sm btn-primary" style="font-size: 9px;" onclick="GoDetails()">Go</a></td>
</tr>`


const addBox = ` <div class="addbox" onclick="newPost()">
                   
<img src="../images/addItem.png" width="9%" style="margin-top: 10px" class="addItem">
</div>`

const requestTFormat = ` <tr>
                                   
<td width="80%">From H.02</td>
<td><div class="btn btn-sm btn-primary" style="cursor:pointer;">Go</div></td>
</tr>`

async function del(n){

    var title = document.getElementsByClassName("Title")[n].innerHTML;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            console.warn(this.responseText);   
            location.reload();
        }
    };
    xhttp.open("DELETE", "/delArticle", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `title=${title}`;
    xhttp.send(att);

}

async function loadSessions(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            console.warn(this.responseText);   
            var data = JSON.parse(this.responseText);

            let format = "";
            let a = 0;
            for(i=0;i<data.length;i++){
                var d = new Date(String(data[i]["date"]));
                var day = d.getDay();
                let s = "";
                switch(day){
                    case 0:
                        s = "Sun";
                        break
                    case 1:
                        s = "Mon";
                        break
                    case 2: 
                        s = "Tues";
                        break
                    case 3:
                        s = "Wed";
                        break
                    case 4:
                        s = "Thur";
                        break
                    case 5:
                        s = "Fri";
                        break
                    case 6:
                        s = "Sat"
                        break
                    default:
                        s = "";
                        break
                }
                format += `<tr>
                <th class="date" width="50%">${data[i]["date"]}</th>
                <td class="day" width="40%">${s}</td>
                <td><a class="btn btn-sm btn-primary" style="font-size: 9px;" onclick="GoDetails(${a})">Go</a></td>
                </tr>`
                a++;
            }
            document.getElementById("Upcoming").innerHTML = format;
        }
    };
    xhttp.open("POST", "/getSessionForPanels", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `username=${localStorage.getItem("username")}`;
    xhttp.send(att);
}

async function editArticle(n){

    let title = document.getElementsByClassName("Title")[n].innerHTML;
    let content = document.getElementsByClassName("Content")[n].innerHTML;
    let date = document.getElementsByClassName("ArticleDate")[n].innerHTML;
    let publisher = document.getElementsByClassName("ArticlePublisher")[n].innerHTML;

    let box = document.getElementsByClassName("ArticleBoxCount")[n];
    box.remove();
    
    let f = `<div class="box" id="newpost">
    <div class="container">
        
        <div class="row">
            <div class="col-9">
                <h3>Create New Post</h3>
            </div>
            <div class="col-3">
                <i style="font-size:15px">Posted by: <span id="Editpostby"></span></i>
                
            </div>
        </div>
       
        <br>
        <input type="text" style="width: 50%;" placeholder="title" id="Edittitle">
        <br>
        <br>
        <textarea style="width:80%; min-height: 400px;" placeholder="content" id="Editcontent"></textarea>
        
        <br>
        <br>
        <div class="row">
            <div class="col-9">
                <!--Cancel-->
                <a href="" class="btn btn-sm btn-danger">Cancel</a>
            </div>
            <div class="col-3">
                <!--Submit-->
                <a class="btn btn-sm btn-info" onclick="Editpublish()">Publish</a>
            </div>
        </div>
    </div> 
    
    </div>`
    var target = document.getElementById("articles")
    target.innerHTML += f;
    localStorage.setItem("originTitle",title);
    document.getElementById("Edittitle").value = title
    document.getElementById("Editpostby").innerHTML = publisher
    document.getElementById("Editcontent").value = content;

}

function Editpublish(){


    let originTitle = localStorage.getItem("originTitle");
    let title = document.getElementById("Edittitle").value;
    let publisher = document.getElementById("Editpostby").innerHTML
    let content = document.getElementById("Editcontent").value
    var s = new Date();
    var m = Number(s.getMonth()) + 1;
    var todayDate = s.getFullYear() + "-" + m + "-" + s.getDate();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            console.warn(this.responseText);   
            if(this.responseText == "safe"){
                location.reload();
            }
        }
    };
    xhttp.open("POST", "/editArticle", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `originalTitle=${originTitle}&title=${title}&content=${content}&publisher=${publisher}&date=${todayDate}`;
    xhttp.send(att);




}




function GoDetails(n){
    var selection = document.getElementsByClassName("date")[n].innerHTML;
    var d = new Date(String(selection));
    var day = d.getDay();
    let s = "";
    switch(day){
        case 0:
            s = "Sun";
            break
        case 1:
            s = "Mon";
            break
        case 2: 
            s = "Tues";
            break
        case 3:
            s = "Wed";
            break
        case 4:
            s = "Thur";
            break
        case 5:
            s = "Fri";
            break
        case 6:
            s = "Sat"
            break
        default:
            s = "";
            break
    }
    localStorage.setItem("date",selection);
    localStorage.setItem("day",s);

    window.open("detail.html")
    
}

async function checkTutorRequest(){
    console.log("CheckTutor")
    var name = localStorage.getItem("username");
   

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            //student & teacher handler
            let data = JSON.parse(this.responseText);
            let format = "";
            console.log(data);
            document.getElementById("requestTutor").innerHTML = "";
            if(data.length!=0){
                for(let i = 0; i<data.length;i++){
                    var event = data[i];
                    let target;
                    let displayname;
                   
                    if(event["requestFrom"] == name){
                        target = "To"
                        let id;
                        if(Number(event["requestToID"]) < 10){id = "0" + event["requestToID"]}
                        else{id = event["requestToID"]}
                        displayname = (event["requestTo"].split(""))[0] + "." + id;
                        format +=` 
                        <tr>
                                    
                        <td width="80%">${target} ${displayname}</td>
                        <td><div class="btn btn-sm btn-primary" style="cursor:pointer;" onclick="requestDetails(\'${event["requestID"]}\')">Go</div></td>
                        </tr>`;
                        
                    }
                    else if(event["requestTo" == name]){
                        target = "From";

                        let a = event["requestFrom"].split(" ");
                        displayname = a[0];
                        format += ` 
                        <tr>
                                    
                        <td width="80%">${target} ${displayname}</td>
                        <td><div class="btn btn-sm btn-primary" style="cursor:pointer;" onclick="requestDetails(\'${event["requestID"]}\')">Go</div></td>
                        </tr>`;
                        
                    }
                }
                document.getElementById("requestTutor").innerHTML  = format;
                   
                   
            }
            else{
                format = "No request so far"
                
            }
            document.getElementById("requestTutor").innerHTML  = format;
            


            //admin handler(need update)
        
    
    
    
        }
    
    
    };
    xhttp.open("POST", "/checkRequestStatus", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `user=${name}`;
    xhttp.send(att);
        

    

}



async function displayArticle(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            var data = JSON.parse(this.responseText);
            var format = "";
            let a = 0;
            for(let i=0;i<data.length;i++){
                let s = localStorage.getItem("level");
                
                if(s == "HIGH"){
                    format +=`
                    <div class="box ArticleBoxCount">
                    <div class="container">
                        
                       <div class="row">
                           <div class="col-10">
                                <h1 class="Title">${data[i]["Title"]}</h1>
                           </div>
                           <div class="col-2"> 
                                <span>Published by:<i class="ArticlePublisher"> ${data[i]["Publisher"]}</i></span>
                           </div>
    
                       </div>
                       <sub class="ArticleDate">${data[i]["Date"]}</sub>
                       <hr>
                       <div class="container Content">${data[i]["Content"]}</div>
                       <div class="row">
                                <div class="col-10">
                                </div>
                                <div class="col-2">
                                    <div class="row">
                                        <div class="col">
                                            <a class="btn btn-sm btn-info" onclick="editArticle(${a})">
                                                <img src="../images/rename.png" width="15px;">
                                            </a>
                                        </div>
                                        <div class="col">
                                            <a class="btn btn-sm btn-danger" onclick="del(${a})"><img src="../images/delete.png" width="15px;"></a>
                                        </div>
                                    </div>
                                </div>
                        </div>
                       <br>
                        
                    </div> 
                    
                </div>`
                }
                else{
                    format += ` <div class="box" >
                    <div class="container">
                        
                       <div class="row">
                           <div class="col-10">
                                <h1 class="Title">${data[i]["Title"]}</h1>
                           </div>
                           <div class="col-2"> 
                                <span><i>Published by: ${data[i]["Publisher"]}</i></span>
                           </div>
    
                       </div>
                       <sub>${data[i]["Date"]}</sub>
                       <hr>
                       <div class="container">
                            <!--Content-->
                            ${data[i]["Content"]}
                       </div>
                       <br>
                        
                    </div> 
                    
                </div>`;
                }
                a++;
            }

            document.getElementById("articles").innerHTML = format;

        }
    };
    xhttp.open("POST", "/showArticle", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `user=${localStorage.getItem("username")}`;
    xhttp.send(att);

}


async function checkLevel(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            console.warn(this.responseText);   
            if(this.responseText == "true"){
                localStorage.setItem("level", "HIGH");
                document.getElementById("addItemBox").innerHTML = addBox;
            }
            else{
                localStorage.setItem("level","LOW");
                console.log(this.responseText)
            }
            displayArticle();
            loadSessions();
            checkTutorRequest();
        }
    };
    xhttp.open("POST", "/checkLevel", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `user=${localStorage.getItem("username")}`;
    xhttp.send(att);

   
}

function requestDetails(n){

    localStorage.setItem("requestTutorCourseID", n);
    window.open("tutorDetails.html","_self");





}


function publish(){
    try{
        var username = localStorage.getItem("username");
        if(username == "" || username == null){
            throw "Empty username tag";
        }
        var title = document.getElementById("title").value;
        var content  = document.getElementById("content").value;
        var s = new Date();
        var m = Number(s.getMonth()) + 1;
        var todayDate = s.getFullYear() + "-" + m + "-" + s.getDate();
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML = this.responseText;
                console.warn(this.responseText);   
                location.reload();
            }
        };
        xhttp.open("POST", "/publishArticle", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        att = `title=${title}&content=${content}&publisher=${username}&date=${todayDate}`;
        xhttp.send(att);

            
    }
    catch(err){
        console.log({err});
    }
  
}


function newPost(){
 
    document.getElementById("main").innerHTML += p;
    document.getElementById("postby").innerHTML = localStorage.getItem("username")
    document.getElementById("addItemBox").remove();
}

/* <div class="box" id="newpost">
                <div class="container">
                    
                    <div class="row">
                        <div class="col-9">
                            <h3>Create New Post</h3>
                        </div>
                        <div class="col-3">
                            <i style="font-size:15px">Posted by: <span id="postby"></span></i>
                            <script>document.getElementById("postby").innerHTML = localStorage.getItem("username")</script>
                        </div>
                    </div>
                   
                    <br>
                    <input type="text" style="width: 50%;" placeholder="title" id="title">
                    <br>
                    <br>
                    <textarea style="width:80%; min-height: 400px;" placeholder="content"></textarea>
                    <!---
                        <span>You are a peer tutor, please sign-up a session in your calendar menu</span>

                    -->
                    <br>
                    <br>
                    <div class="row">
                        <div class="col-9">
                            <!--Cancel-->
                            <a href="" class="btn btn-sm btn-danger">Cancel</a>
                        </div>
                        <div class="col-3">
                            <!--Submit-->
                            <a href="" class="btn btn-sm btn-info" onsubmit="publish()">Publish</a>
                        </div>
                    </div>
                </div> 
                
            </div> */