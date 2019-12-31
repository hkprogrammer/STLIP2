function search(condition){
    var selector = String(condition);
    console.warn(selector)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            //console.warn(this.responseText);   
            var data = JSON.parse(this.responseText);
            
            let format = "";
            for(let i=0;i<data.length;i++){
                format += ``;
            }


        }
    };
    xhttp.open("POST", "/searchTutor", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `condition=${selector}&username=${localStorage.getItem("username")}`;
    xhttp.send(att);

}
