var subjects = [];

document.getElementById('subject').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      // code for enter
      console.log("added " + this.value);

      var v = String(this.value);
      
      var target = document.getElementById("subj");
      target.innerHTML += `<a class="btn btn-sm btn-primary subjbut" onclick="del(\`${v}\`)" id="${v}"><span style="color:white;">${v}</span></a>`
      subjects.push(v);
      console.log(v);
      //<a class="btn btn-sm btn-primary subjbut"><span style="color:white;">{Subject}</span></a>
      this.value = "";
    } 
});

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
  var pass = document.getElementById("password").value;
  var confirmPass = document.getElementById("passwordConfirm").value;

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
    if(pass != confirmPass){
      alert("Password does not match");
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
            if((JSON.parse(this.responseText))["status"] == "success"){
              localStorage.setItem("DetailResponse", JSON.stringify(this.responseText));
              location.replace("success.html");
            }
            else{
              console.log(this.responseText);
              alert("An error occured, please try again.")
            }
            
        }
      };
      xhttp.open("POST", "/addTutor", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      //xhttp.send("fname=Henry&lname=Ford");
      
      let sendcontent = `name=${name}&grade=${grade}&email=${email}&subject=${s}&password=${confirmPass}`;
      xhttp.send(sendcontent)
    }
  }


  
 
  

}

function reset(){
  document.getElementById("name").value = "";
  document.getElementById("grade").value = "none";
  document.getElementById("email").value = "";
  document.getElementById("password").value ="";
  document.getElementById("passwordConfirm").value = "";

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
    subjects.push(n);
    let format = `<a class="btn btn-sm btn-primary subjbut" onclick="del(\`${n}\`)" id="${n}"><span style="color:white;">${n}</span></a>`;
    document.getElementById("courseList").innerHTML += format;

  }
  
  
}
  