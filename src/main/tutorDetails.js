function loadTutorRequestDetail(){

    let id = localStorage.getItem("requestTutorCourseID");
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        
            let data = JSON.parse(this.responseText);
            
            let r = data["requestData"]
            let s = data["studentInfo"];
            var sgrade = "";
           
            switch(Number(s["grade"])){
                
                case 9:
                   sgrade = "Freshman";
                    break
                case 10:
                    sgrade = "Sophomore";
                    break
                case 11:
                    sgrade = "Junior";
                    break
                case 12: 
                    sgrade = "Senior";
                    break

                default:
                    sgrade = "Freshman";
                    break
            }
            let studentFormat = `
            <div class="row SearchInverseBox infoCard" id=\"${s["username"]}\">
                <div class="col-3">
                    <img src="../images/avatar.jpg"width="100%">
                    <span>${sgrade}</span>
                </div>
                <div class="col-9">
                    
                    <h3>${s["username"]}</h3>
                    <div class="btn btn-sm btn-primary">Requested Student</div>
                    
                    <hr>
                    
                     ${s["email"]}
                </div>

            </div>
           `;

            let t = data["tutorInfo"];
            let id;
            if(t["ID"] < 10){
                id = "0" + t["ID"];
            }
            else{
                id = t["ID"]
            }
            let tutorDisplayName = (t["username"].split(""))[0] + "." + id;
            var tgrade = "";
            switch(Number(t["grade"])){
                
                case 9:
                    tgrade = "Freshman";
                    break
                case 10:
                    tgrade = "Sophomore";
                    break
                case 11:
                    tgrade = "Junior";
                    break
                case 12: 
                    tgrade = "Senior";
                    break

                default:
                    tgrade = "Freshman";
                    break
            }
            let tutorFormat = `
                <div class="row SearchInverseBox infoCard" id=\"${t["username"]}\ tutorCard">
                    <div class="col-3">
                        <img src="../images/avatar.jpg"width="100%">
                        <span>${tgrade}</span>
                    </div>
                    <div class="col-9">
                        
                        <h3>${tutorDisplayName}</h3>
                        <div class="btn btn-sm btn-success">Requested Tutor</div>
                        
                        <hr>
                        
                            <div class="btn btn-sm btn-info">${r["subject"]}</div>
                            <span style="font-size:15px;">${t["email"]}</span>
                    </div>

                </div>`;
            let v;

            if(r["valid"] == 0){
                v = "Canceled"
                document.getElementById("cancel").classList.add("disabled");
                document.getElementById("accept").classList.add("disabled");
                document.getElementById("cancel").onclick = "";
                document.getElementById("accept").onclick = "";

            }
            else if(r["valid"] == 1){
                v= "Pending"
                
            }
            else if(r["valid"] == 2){
                v = "Successfully Paired"
                document.getElementById("cancel").classList.add("disabled");
                document.getElementById("accept").classList.add("disabled");
                document.getElementById("cancel").onclick = "";
                document.getElementById("accept").onclick = "";
            }

            let listFormat = ` 
            <tr>
                <th>Requested Date:</th>
                <td>${r["requestDate"]}</td>
            </tr>
            <tr>
                <th>Requested Subject:</th>
                <td class="btn btn-sm btn-secondary">${r["subject"]}</td>
            </tr>
            <tr>
                <th>Validation: </th>
                <td>${v}</td>
            </tr>
            <tr style="visibility:hidden;">
                <th>Request ID: </th>
                <td id="ID">${r["requestID"]}</td>
            </tr>
            `




            document.getElementById("requestFrom").innerHTML = studentFormat;
            document.getElementById("requestTo").innerHTML = tutorFormat;
            document.getElementById("displayDetailedList").innerHTML = listFormat;
            if(localStorage.getItem("username") == r["requestFrom"]){
                document.getElementById("accept").classList.add("disabled")
            }
        
        }
    };
    xhttp.open("POST", "/loadRequestDetails", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `requestID=${id}`;
    xhttp.send(att);


}


function cancel(){

    let id = document.getElementById("ID").innerHTML;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            
           location.reload();
         
        }
    };
    xhttp.open("POST", "/cancelRequest", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `name=${localStorage.getItem("username")}&requestID=${id}`;
    xhttp.send(att);
    


    
}

function accept(){

    let id = document.getElementById("ID").innerHTML;

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
    
    var f = d.getFullYear() + "-" + mM + "-" + y;
   
    

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
           
        if(this.responseText == "safe"){
            location.replace("index.html")
        }
         
        }
    };
    xhttp.open("POST", "/acceptRequest", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `name=${localStorage.getItem("username")}&requestID=${id}&date=${f}`;
    xhttp.send(att);



}

// let s = "";
    // switch(d.getDay()){
    // case 0:
    //     s = "Sunday";
    //     break
    // case 1:
    //     s = "Monday";
    //     break
    // case 2: 
    //     s = "Tuesday";
    //     break
    // case 3:
    //     s = "Wednesday";
    //     break
    // case 4:
    //     s = "Thursday";
    //     break
    // case 5:
    //     s = "Friday";
    //     break
    // case 6:
    //     s = "Saturday"
    //     break
    // default:
    //     s = "";
    //     break
    // }