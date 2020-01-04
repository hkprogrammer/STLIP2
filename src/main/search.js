function search(condition){
    var selector = String(condition);
    console.warn(selector)

    document.getElementById("tutorCards").innerHTML = "<img src=\"../images/loading.gif\" width=\"60%\">"

    localStorage.setItem("course", selector);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            //console.warn(this.responseText);   
            var data = JSON.parse(this.responseText);
            
            let format = "";
            for(let i=0;i<data.length;i++){
                var person = data[i];

                var name = person["username"];
                var g = person["grade"]
                var email = person["email"];
                var s = person["subjects"]
                var subjects = s.split(",");
                var subjectsFormat = ""
                var id = person["ID"];

                var n = name.split("");

                if(Number(id) < 10){
                    id = "0" + id;
                }


                var displayName = n[0] + "." + id;


                var grade = "";
                console.log(Number(g))
                switch(Number(g)){
                    
                    case 9:
                        grade = "Freshman";
                        break
                    case 10:
                        grade = "Sophomore";
                        break
                    case 11:
                        grade = "Junior";
                        break
                    case 12: 
                        grade = "Senior";
                        break

                    default:
                        grade = "Freshman";
                        break
                }


                for(let z=0;z<subjects.length;z++){
                    if(subjects[z] == "" || subjects[z] == " "){
                        subjectsFormat += ``
                    }
                    else{
                        subjectsFormat += `<span class="btn btn-sm btn-primary subjectbuttons" style="color:white; font-weight:bold; font-size: 10px;">${subjects[z]}</span>`
                    }
                    
                }
                format += `
                <div class="row SearchInverseBox infoCard" id=\"${name}\">
                    <div class="col-3">
                        <img src="../images/avatar.jpg"width="100%">
                        <span>${grade}</span>
                    </div>
                    <div class="col-9">
                        
                        <h3>${displayName}</h3>
                        <div class="btn btn-sm btn-success" style="cursor:pointer;" onclick="request(\'${name}\')">Request Tutor</div>
                        
                        <hr>
                        
                            ${subjectsFormat}
                    </div>

                </div>`;
            }
            if(format == ""){
                format = "No Tutor Found"
            }
            document.getElementById("tutorCards").innerHTML = format;

        }
    };
    xhttp.open("POST", "/searchTutor", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `condition=${selector}&username=${localStorage.getItem("username")}`;
    xhttp.send(att);

}


async function request(n){
    console.log(n)
    var d = new Date();
    var m = Number(d.getMonth()) + 1;
    var mM = String(m);
    if(mM.length == 1){
    mM = "0" + mM;
    }
    //console.warn(mM)
    var y = String(d.getDate());
    if(y.length == 1){
    y = "0" + y;
    }
    console.log(y);
    var f = d.getFullYear() + "-" + mM + "-" + y;
    console.log(f);
    let s = "";
    switch(d.getDay()){
    case 0:
        s = "Sunday";
        break
    case 1:
        s = "Monday";
        break
    case 2: 
        s = "Tuesday";
        break
    case 3:
        s = "Wednesday";
        break
    case 4:
        s = "Thursday";
        break
    case 5:
        s = "Friday";
        break
    case 6:
        s = "Saturday"
        break
    default:
        s = "";
        break
    }

    
    console.log(f)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        console.log(this.responseText)
        //location.reload();
       
    }
    };
    xhttp.open("POST", "/requestTutor", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    let sendcontent = `from=${localStorage.getItem("username")}&to=${String(n)}&date=${f}&course=${localStorage.getItem("course")}`;
    xhttp.send(sendcontent);

}