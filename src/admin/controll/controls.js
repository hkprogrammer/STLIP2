function addUsr(){
    window.open("addUsr.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=800");
}
document.getElementById("headingname").innerHTML = String(localStorage.getItem("username"));
checkStudent();
function checkStudent(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText,"response")
            // console.log(typeof(this.response),typeof(this.responseText));
            // console.log(this.responseType);

            var j = JSON.parse(this.responseText);

            for(let i = 0; i < j.length;i++){
                if(j[i]["username"] == "admin"){
                    j.splice(i,1);
                }


            }
            //console.log(j)
            var ts = document.getElementById("tutorslist");
            ts.innerHTML = `<tr>
                                <td>#</td>
                                <td width="30%">Name</td>
                                <td>role</td>
                                <td width="20%">modify name</td>
                                <td>delete</td>
                            </tr>`;

            for(let i = 0; i< j.length; i++){
                ts.innerHTML += `<tr id=\"${j[i]["username"]}\">
                <td>${j[i]["ID"]}</td>
                <td>${j[i]["username"]}</td>
                <td>
                    <select>
                        <option value="Tutor">Tutor</option>
                        <option value="------">-----</option>
                        <option value="Student">Student</option>
                    </select>
                </td>
                <td>
                    <a onclick="edit(this.parentElement.parentElement.childNodes[3].innerHTML)" class="btn btn-sm btn-info "><img src="../../images/rename.png" height="25spx">
                    </a>
                </td>
                <td>
                    <a onclick="del(this.parentElement.parentElement.childNodes[3].innerHTML)" class="btn btn-sm btn-danger "><img src="../../images/delete.png" height="25spx">
                    </a>
                </td>
                </tr>`
            }
            ts.innerHTML += `<tr>
                                <!--Add Usr-->
                                <td colspan="5"><a onclick="addUsr()" class="btn btn-sm btn-secondary" style="font-size:15px; font-weight:bold; color:white">+ Add a peer tutor</a></td>
                            </tr>`
            









            //console.log(j[0]["username"]);
        }
    };
    xhttp.open("GET", "/checkTutors", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("fname=Henry&lname=Ford");
    xhttp.send()



    setTimeout(checkStudent, 10000);
}

/**
 * 
 *  <tr>
        <td>#</td>
        <td width="30%">Name</td>
        <td>role</td>
        <td width="20%">modify name</td>
        <td>delete</td>
    </tr>
 * 
 * 
 * 
 * <tr>
        <td>{#}</td>
        <td>{Name}</td>
        <td>
            <select>
                <option value="Tutor">Tutor</option>
                <option value="------">-----</option>
                <option value="Student">Student</option>
            </select>
        </td>
        <td>
            <a onclick="edit(this.parent.parent.childnodes[1].innerHTML)" class="btn btn-sm btn-info "><img src="../../images/rename.png" height="25spx">
            </a>
        </td>
        <td>
            <a onclick="del(this.parent.parent.childnodes[1].innerHTML)" class="btn btn-sm btn-danger "><img src="../../images/delete.png" height="25spx">
            </a>
        </td>
    </tr>
    <tr>
        <!--Add Usr-->
        <td colspan="5"><a onclick="addUsr()" class="btn btn-sm btn-secondary" style="font-size:15px; font-weight:bold; color:white">+ Add a peer tutor</a></td>
    </tr>
    * 
 * 
*/

function del(n){
    
    if(confirm("Are you sure?") == true){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText,"response")
                
                checkStudent();
                document.getElementById(n).remove();
            
            }
        };
        xhttp.open("DELETE", "/delTutor", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //xhttp.send("fname=Henry&lname=Ford");
        
        let sendcontent = `name="${n}"`;
        xhttp.send(sendcontent)
    }
    else{
        console.log("canceled delete student "+ n);
    }

    
       


}
function edit(n){
    
    var result = prompt("Rename:");
    if(result != null || result != "" || result != " "){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText,"response")
                
                checkStudent();
                
            
            }
        };
        xhttp.open("POST", "/renameTutor", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //xhttp.send("fname=Henry&lname=Ford");
        
        let sendcontent = `name="${n}"&newname="${result}"`;
        xhttp.send(sendcontent)
    }
    else{
        console.log("empty rename")
    }
    

}