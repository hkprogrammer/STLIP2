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
            <a href="" class="btn btn-sm btn-info">Submit</a>
        </div>
    </div>
</div> 

</div> `;

function newPost(){
 
    document.getElementById("main").innerHTML += p;
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
                            <a href="" class="btn btn-sm btn-info">Submit</a>
                        </div>
                    </div>
                </div> 
                
            </div> */