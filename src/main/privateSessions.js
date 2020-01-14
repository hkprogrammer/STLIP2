var s = new Date();
var m = Number(s.getMonth()) + 1;
var mM = String(m);
if(mM.length == 1){
  mM = "0" + mM;
}
var y = String(s.getDate());
if(y.length == 1){
  y = "0" + y;
}
var f = s.getFullYear() + "-" + mM + "-" + y;
console.log({s,f});

var submitDateList = [];
let todayDate = new Date(f).valueOf();
var roomID;


function loadDetail(){

    var roomID = localStorage.getItem("privateSessionID");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            console.warn(this.responseText);   
            var data = JSON.parse(this.responseText);
            
            let s = data["studentInfo"]
            let t = data["tutorInfo"];
            let r = data["roomData"];
            roomID = r["pairID"];

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
                        
                            <div class="btn btn-sm btn-info">${r["pairSubject"]}</div>
                            <span style="font-size:15px;">${t["email"]}</span>
                    </div>

                </div>`;
           

          
           
            let listFormat = ` 
            <tr>
                <th>Began Date:</th>
                <td>${r["pairDate"]}</td>
            </tr>
            
          
            <tr style="visibility:hidden;">
                <th>Room ID: </th>
                <td id="ID">${r["pairID"]}</td>
            </tr>
            `
            document.getElementById("studentInfo").innerHTML = studentFormat;
            document.getElementById("tutorInfo").innerHTML = tutorFormat;
            document.getElementById("displayDetailedList").innerHTML = listFormat;
            startup()

        }
    };
    xhttp.open("POST", "/loadRoomDetails", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `roomID=${roomID}`;
    xhttp.send(att);
    



}

var listOfDate = [];



function startup(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("demo").innerHTML = this.responseText;
     if(this.responseText != ""){
        console.log(this.responseText)
        let rawDates = JSON.parse(this.responseText);
        
        for(i=0;i<rawDates.length;i++){
          var temp = {
            "title": "PS",
            "start" : rawDates[i]
          }  
          listOfDate.push(temp)
        }
        console.warn(listOfDate)
        var calendarEl = document.getElementById('calendar');
  
     
  
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
          header: {
            left: 'prev,next ',
            center: 'title',
            right: 'today'
          },
          navLinks:  false, // can click day/week names to navigate views
          selectable: true,
          selectMirror: true,
          select: function(arg) {
            //var title = prompt('Event Title:');
            // if (title) {
            //   calendar.addEvent({
            //     title: title,
            //     start: arg.start,
            //     end: arg.end,
            //     allDay: arg.allDay
            //   })
            let d = arg.start;
          
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
            
            let letThisDate = new Date(f).valueOf();
            if(letThisDate >= todayDate){
                //Future Day
                addDate(f);
            }
            else if(letThisDate < todayDate){
                //Past Day
                alert("You have selected a past date, please try again")
            }
            else{
                //error
                console.warn("err", todayDate,letThisDate);
            }


           
            
           // console.log(calendar);
            
            calendar.unselect()
            
          },
          editable: true,
          eventLimit: true, 
          events: listOfDate
        });
        calendar.setOption('aspectRatio', 1);
        calendar.render();
        
        console.log(listOfDate)
        $(`*[data-date=\"${f}\"]`)[0].style.backgroundColor = "rgb(252, 248, 227,0.5)";
     }
      
    }
  };
  xhttp.open("POST", "/loadPrivateSessionDate", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let attr = `roomID=${localStorage.getItem("privateSessionID")}`
  xhttp.send(attr);
 





  //calendar Initialization
  
}


async function addDate(n){
    let flag = false;
    if(submitDateList.length>0){
        for(i=0;i<submitDateList.length;i++){
            if(submitDateList[i] == n){
                
                flag = true;
                break
            }
        }
    }
    else{
        
    }
    

    if(flag){
        alert("Please avoid repeating dates");
    }
    else{
        let format = `<div class="btn btn-sm btn-primary" id="${n}" onclick="del('${n}')" style="cursor:pointer;margin:10px;">${n}</div>`;
        submitDateList.push(n);
        document.getElementById("selectiveDates").innerHTML += format;
    }
    

}
async function submitDate(){
    var roomID = document.getElementById("roomID").innerh
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            console.warn(this.responseText);   

        }
    };
    xhttp.open("POST", "/submitDates", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `dates=${submitDateList}&RoomID=${roomID}`
    
    document.getElementById(n).remove();
    for(i=0;i<submitDateList.length;i++){
        if(submitDateList[i] == n){
            submitDateList.splice(i,1)
        }
    }
}



// var s = new Date();
// var m = Number(s.getMonth()) + 1;
// var mM = String(m);
// if(mM.length == 1){
//   mM = "0" + mM;
// }
// var y = String(s.getDate());
// if(y.length == 1){
//   y = "0" + y;
// }
// var f = s.getFullYear() + "-" + mM + "-" + y;
// console.log({s,f});





// console.log(typeof(f));    
// localStorage.setItem("date", f);


