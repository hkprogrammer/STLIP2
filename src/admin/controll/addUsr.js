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


function submit(){ 
  //name,grade level, email, subjects
  var name = document.getElementById("name").value;
  var grade = document.getElementById("grade").value;
  var email = document.getElementById("email").value;

  var s = "";
  for(let i = 0; i<subjects.length;i++){
      
      if(i == subjects.length - 1){
          s += subjects[i];
      }
      else{
        s += subjects[i] + ","
      }   
  }
  console.log({name,email,grade,s});
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText,"response")
        
        location.replace("success.html");
    }
  };
  xhttp.open("POST", "/addTutor", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //xhttp.send("fname=Henry&lname=Ford");
  
  let sendcontent = `name=${name}&grade=${grade}&email=${email}&subject=${s}`;
  xhttp.send(sendcontent)
  

}

  