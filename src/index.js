var name,email,password,confirmpassword,grade;

function loadFramework(){
    if(localStorage.getItem("username") != null){
        window.open("main/","_self")
    }
}


//getGlobalVars 0 is login, 1 is signup form;
function getGlobalVars(n){
    
    switch(n){
        case 0:
            name = document.getElementById("username").value;
            password = document.getElementById("password").value;
            break
        case 1:
            name = document.getElementById("username").value;
            password = document.getElementById("password").value;
            confirmpassword = document.getElementById("confirmpass").value;
            email = document.getElementById("email").value;
            grade = document.getElementById("grade").value;
            break
            
        default:
            console.log("err");
            break    
    }
    
    
    

}
var inputPassword = document.getElementById("password")
inputPassword.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     login();
    }
  });
function login(){
    getGlobalVars(0);


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        console.log(this.responseText)
        
        if(this.responseText != "Invalid Login"){
            var data = JSON.parse(this.responseText);
            localStorage.removeItem("username");
            localStorage.setItem("username", data["username"]);
            location.replace("main/")
        }
        else{
            console.log(data)
            //Invalid Login
            document.getElementById("invalid").innerHTML = this.responseText;
        }
    }
    };
    xhttp.open("POST", "/loginStudent", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    let sendcontent = `username=${name}&password=${password}`;
    xhttp.send(sendcontent);


}
function signup(){
    getGlobalVars(1);
    if(name != "" && password != "" && confirmpassword != ""){
        if(confirmpassword == password){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                //document.getElementById("demo").innerHTML = this.responseText;
               
                    console.log(this.responseText)
                    if(this.responseText != "conflict"){
                        location.replace("index.html")
                    }
                    else{
                        console.log(this.responseText)
                    }
                    
                }
            };
            xhttp.open("POST", "/register", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //xhttp.send("fname=Henry&lname=Ford");
            let sendcontent = `username=${name}&password=${password}&email=${email}&grade=${grade}`;
            xhttp.send(sendcontent); 
            
        }
        else{
            //password not match
        }
    }
    
}