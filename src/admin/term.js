
function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    console.log(username,password)
    loadDoc(username,password);
}


function loadDoc(a,b) {
   
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        if(this.responseText == "true"){
            
            localStorage.setItem("username",a);
            changePage("adminUsr");
            console.log("acess");
        }
        else{
           
            document.getElementById("invalidmsg").style.visibility = "visible";
            console.log(this.responseText)
            if(this.responseText == "level"){
                document.getElementById("invalidmsg").innerHTML = "You are not admin"
            }
        }

        
    }
    };
    xhttp.open("POST", "/adminLogin", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    console.log(a,b)
    let sendcontent = `username=${a}&password=${b}`;
    xhttp.send(sendcontent);
}
function changePage(l){
    console.log(l)
    if(l == "adminUsr"){
        location.replace("/admin/controll/")
    }
}