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