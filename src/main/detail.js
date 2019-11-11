function startup(){
    var displayDate = document.getElementById("displayDate");
    let format = localStorage.getItem("day") + ", " + localStorage.getItem("date");
    displayDate.innerHTML = format;
    document.getElementById("headerName").innerHTML = localStorage.getItem("username")
}


function signup(){
    var name = localStorage.getItem("username");
    var date = localStorage.getItem("date");


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        console.log(this.responseText)
        loadInformations()
    }
    };
    xhttp.open("POST", "/signupsession", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    let sendcontent = `username=${name}&date=${date}`;
    xhttp.send(sendcontent);

}

loadInformations();
function loadInformations(){

    var tutorList = document.getElementById("tutors");
    var student1 = document.getElementById("studentsodd");
    var student2 = document.getElementById("studentseven");
    

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        console.log(this.responseText)
        var result = JSON.parse(this.responseText);
        tutorList.innerHTML="";
        for(i=0;i<result.length;i++){
            //console.log(result[i])
            var data = result[i];
            var name = data["name"];
            var g = data["grade"];
            var s = data["subjects"];
            var id = data["id"];

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

            var subjects = s.split(",");
            var subjectsFormat = ""
            
            for(let z=0;z<subjects.length;z++){
                if(subjects[z] == "" || subjects[z] == " "){
                    subjectsFormat += ``
                }
                else{
                    subjectsFormat += `<span class="btn btn-sm btn-primary subjectbuttons" style="color:white; font-weight:bold">${subjects[z]}</span>`
                }
                
            }
            let temp;
            if(name == localStorage.getItem("username")){
                temp = `
                <div class="row inverseBox infoCard" id=\"${name}\">
                <div class="col-3">
                    <img src="../images/avatar.jpg"width="100%">
                    <span>${grade}</span>
                </div>
                <div class="col-9">
                    
                    <h3>${name}</h3><img src="../images/delete.png" class="btn btn-sm btn-danger" width="30px" id="` + name + "btn" +`">
                    
                    <hr>
                    
                        ${subjectsFormat}
                </div>

                </div>
                `
                flag=true;
                console.log(temp);
            }
            else{
                temp = `
                <div class="row inverseBox infoCard" id=\"${name}\">
                <div class="col-3">
                    <img src="../images/avatar.jpg"width="100%">
                    <span>${grade}</span>
                </div>
                <div class="col-9">
                    <h3>${name}</h3>
                    
                    <hr>
                    
                        ${subjectsFormat}
                </div>

                </div>
                `
            }
            
            
            tutorList.innerHTML += temp;
            let target;
            if(document.body.contains(document.getElementById(localStorage.getItem("username") +"btn"))){
                target = document.getElementById(localStorage.getItem("username") +"btn");
                target.addEventListener("click",function(){
                    deleteFromList(localStorage.getItem("username"));
                })
            }
            else{
                    
            }
        
        }

    }
    };
    xhttp.open("POST", "/loadTutors", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let att = `date=${localStorage.getItem("date")}`;
    xhttp.send(att);

    //loadStudents
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        console.log(this.responseText)
        var result = JSON.parse(this.responseText);
        student1.innerHTML="";
        student2.innerHTML="";
        var flag = false;
        var endDispalyStudentList = [];
        for(i=0;i<result.length;i++){
            //console.log(result[i])
            var data = result[i];
            var name = data["name"];
            var g = data["grade"];
            var id = data["id"];

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

            
            let temp;
            if(name == localStorage.getItem("username")){
                 temp = `
                    <div class="studentCard row" id=\"${name}\">
                    <div class="col-5">
                        <img src="../images/avatar.jpg" width="100%">
                        <span class="grade">${grade}</span>
                    </div>
                    <div class="col-7">
                        <span>${name}</span><img src="../images/delete.png" class="btn btn-sm btn-danger" width="30px" id="` + name + "btn" + `">
                    </div>
                    </div>
                    <br>
                    `
                    flag = true;
            }
            else{
                 temp = `
                <div class="studentCard row" id=\"${name}\">
                <div class="col-5">
                    <img src="../images/avatar.jpg" width="100%">
                    <span class="grade">${grade}</span>
                </div>
                <div class="col-7">
                    <span>${name}</span>
                </div>
                </div>
                <br>
                `
            }
           
            endDispalyStudentList.push(temp)
            
            console.log(temp);
        
        }
        for(i=0;i<endDispalyStudentList.length;i++){
            if(i%2 != 0){
                student1.innerHTML += endDispalyStudentList[i];
                
            }
            else{
                student2.innerHTML += endDispalyStudentList[i];
                
            }
        }
        // if(flag){
        //     let target = document.getElementById(name+"btn");
        //     console.log(target)
        //     target.addEventListener("click",function(){
        //         deleteFromList(name);
        //     })
        // }
        
        //onclick="deleteFromList(\'` + localStorage.getItem("username") + `\')"

        let target;
        if(document.body.contains(document.getElementById(localStorage.getItem("username") +"btn"))){
            target = document.getElementById(localStorage.getItem("username") +"btn");
            target.addEventListener("click",function(){
                deleteFromList(localStorage.getItem("username"));
            })
        }
        else{
                
        }
    }
    };
    xhttp.open("POST", "/loadStudents", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `date=${localStorage.getItem("date")}`;
    xhttp.send(att);
}

function deleteFromList(n){
    var name = n;
    var date = localStorage.getItem("date");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
       
        console.log(this.responseText)
        location.reload();
       
    }
    };
    xhttp.open("DELETE", "/deleteUsrFromSession", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    let sendcontent = `username=${name}&date=${date}`;
    xhttp.send(sendcontent);

}



        

// }
// `
// <div class="row inverseBox infoCard">
// <div class="col-3">
//     <img src="../images/avatar.jpg"width="100%">
// </div>
// <div class="col-9">
//     <h3>{Student Name}</h3>
//     <span>Junior</span>
//     <hr>
    
//         <span class="btn btn-sm btn-primary" style="color:white; font-weight:bold">Japanese I-V</span>
//         <span class="btn btn-sm btn-primary" style="color:white; font-weight:bold">Mandarin I-V</span>
// </div>

// </div>
// `
// `
// <div class="studentCard row">
// <div class="col-5">
//     <img src="../images/avatar.jpg" width="100%">
//     <span >Junior</span>
// </div>
// <div class="col-7">
//     <span>Hitoki Kidahashi</span>
// </div>
// </div>
// <br>
// `