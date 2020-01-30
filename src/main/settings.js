var subjects = [];

// document.getElementById('subject').addEventListener('keypress', function (e) {
//     var key = e.which || e.keyCode;
//     if (key === 13) { // 13 is enter
//       // code for enter
//       console.log("added " + this.value);

//       var v = String(this.value);
      
//       var target = document.getElementById("subj");
//       target.innerHTML += `<a class="btn btn-sm btn-primary subjbut" onclick="del(\`${v}\`)" id="${v}"><span style="color:white;">${v}</span></a>`
//       subjects.push(v);
//       console.log(v);
//       //<a class="btn btn-sm btn-primary subjbut"><span style="color:white;">{Subject}</span></a>
//       this.value = "";
//     } 
// });

function del(a){
  let t = document.getElementById(String(a));
  console.log({t,a})
  t.remove();
  for( var i = 0; i < subjects.length; i++){ 
    if (subjects[i] === a) {
      subjects.splice(i, 1); 
    }
  }

}
function removeElement(a){
  let t = document.getElementById(String(a));
  console.log({t,a})
  t.remove();
}

function submit(){ 
  //name,grade level, email, subjects
  var name = document.getElementById("name").value;
  var grade = document.getElementById("grade").value;
  var email = document.getElementById("email").value;
 

  let splitEmail = email.split("");
  let flag = false;
  for(let i = 0; i < splitEmail.length;i++){
    console.log(splitEmail[i])
    if(splitEmail[i] == "m"){
      let d = splitEmail.length - (i + 1);
      let f = "";
      for(let v = i; v<splitEmail.length;v++){
          f += splitEmail[v];
      }
      console.log({f,i})
      if(f == "midpac.edu"){
        flag=true;
        break
      
      }
      else{

      }

    }
  }

  if(!flag){
    alert("Email must be student email");
  }
  else{
   
 
      var s = "";
      for(let i = 0; i<subjects.length;i++){
          
          if(i == subjects.length - 1){
              s += subjects[i];
          }
          else{
            s += subjects[i] + ","
          }   
      }
      
      var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText,"response")
            if(this.responseText == "safe"){
                alert("Successfully updated your account, you will be logged out.");
                location.replace("logout.html");
            }
            else{
                alert("Please try again.")
            }
            
        }
      };
      xhttp.open("POST", "/editTutor", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      //xhttp.send("fname=Henry&lname=Ford");
      
      let sendcontent = `name=${name}&grade=${grade}&email=${email}&subject=${s}&ID=${Number(document.getElementById("ID").innerHTML)}`;
      xhttp.send(sendcontent)
    
  }


  
 
  

}

function reset(){
  document.getElementById("name").value = "";
  document.getElementById("grade").value = "none";
  document.getElementById("email").value = "";
  

  for(let i = 0; i<subjects.length;i++){
    removeElement(subjects[i]);
  }


  subjects.splice(0,subjects.length);
}


async function search(n){
  
  if(subjects.length >= 8){
    alert("You have selected too much courses, please only select eight courses in total.")
  }
  else{
      //console.log(subjects.indexOf(n),n,subjects)
    if(subjects.indexOf(n) == -1){
        subjects.push(n);
        let format = `<a class="btn btn-sm btn-primary subjbut" onclick="del(\`${n}\`)" id="${n}"><span style="color:white;">${n}</span></a>`;
        document.getElementById("courseList").innerHTML += format;
    }
    else{
        alert("Please do not select duplicates.")
    }
    

  }
  
  
}

function load(){

    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText,"response")
            var data = JSON.parse(this.responseText);
            document.getElementById("name").value = data[0]["username"];
            document.getElementById("grade").value = data[0]["grade"];
            document.getElementById("email").value = data[0]["email"];
            document.getElementById("name").disabled = "true";
            document.getElementById("ID").innerHTML = data[0]["ID"];

            let s = data[0]["subjects"].split(",");
            subjects = s;
            
            for(let i=0;i<s.length;i++){
               
              
                //subjects.push(s[i]);
                let format = `<a class="btn btn-sm btn-primary subjbut" onclick="del(\`${s[i]}\`)" id="${s[i]}"><span style="color:white;">${s[i]}</span></a>`;
                document.getElementById("courseList").innerHTML += format;
                
                  

            }


        }
      };
      xhttp.open("POST", "/requestTutorInformation", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      //xhttp.send("fname=Henry&lname=Ford");
      
      let sendcontent = `username=${localStorage.getItem("username")}`;
      xhttp.send(sendcontent)


}
load();