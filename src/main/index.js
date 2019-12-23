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


const addBox = ` <div class="addbox" onclick="newPost()">
                   
<img src="../images/addItem.png" width="9%" style="margin-top: 10px" class="addItem">
</div>`

async function displayArticle(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            var data = JSON.parse(this.responseText);
            var format = "";

            for(let i=0;i<data.length;i++){
                format += ` <div class="box" >
                <div class="container">
                    
                   <div class="row">
                       <div class="col-10">
                            <h1>${data[i]["Title"]}</h1>
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
                document.getElementById("addItemBox").innerHTML = addBox;
            }
            else{
                console.log(this.responseText)
            }
            displayArticle();
        }
    };
    xhttp.open("POST", "/checkLevel", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `user=${localStorage.getItem("username")}`;
    xhttp.send(att);

   
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