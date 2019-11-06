function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    console.log(username,password)
    loadDoc();
}


function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
        console.log(this.responseText);
    }
    };
    xhttp.open("POST", "/check", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    xhttp.send("name=Hitoki&age=1")
}