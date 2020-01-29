var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e=e.replace(/\r\n/g,"\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}


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

    roomID = localStorage.getItem("privateSessionID");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            //console.warn(this.responseText);   
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
            let Fsubj;
            if(r["pairSubject"] == "Any"){
                Fsubj = t["subjects"];
            }
            else{
                Fsubj = r["pairSubject"]
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
                        
                            <div class="btn btn-sm btn-info">${Fsubj}</div>
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
        //console.log(this.responseText)
        let rawDates = JSON.parse(this.responseText);
        
        for(i=0;i<rawDates.length;i++){
          var temp = {
            "title": "PS",
            "start" : rawDates[i]
          }  
          listOfDate.push(temp)
        }
        //console.warn(listOfDate)
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
    
    if(confirm("Submit?")){
        roomID = localStorage.getItem("privateSessionID")
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML = this.responseText;
               
                location.reload();
            }
        };
        xhttp.open("POST", "/submitDates", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        att = `dates=${submitDateList}&RoomID=${roomID}`
        xhttp.send(att);
    }
    

}
async function del(n){

    document.getElementById(n).remove();
    for(i=0;i<submitDateList.length;i++){
        if(submitDateList[i] == n){
            submitDateList.splice(i,1)
        }
    }
}




async function displayArticle(){
    roomID = localStorage.getItem("privateSessionID")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            var data = JSON.parse(this.responseText);
            console.log({data});
            var format = "";
            let a = 0;
            for(let i=0;i<data.length;i++){
              
               
                var compressedImg = Base64.encode(data[i]["content"]);
                console.log(compressedImg)
                if(data[i]["publisher"] == localStorage.getItem("username")){
                    console.log(data[i])
                    format +=`
                    <div class="box ArticleBoxCount">
                    <div class="container">
                       <div class="container Content" style="font-size:110%;">${data[i]["content"]}</div>
                       <br>
                       <div class="row"><div class="col-10">
                       
                       <sub class="ArticleDate">${data[i]["date"]}</sub>
                       <br>
                       <span>By:<i class="ArticlePublisher"> ${data[i]["publisher"]}</i></span>
                       <br>
                       </div><div class="col"><br><a class="btn btn-sm btn-danger" onclick="del('${compressedImg}')" id="${compressedImg}"><img src="../images/delete.png" width="15px;"></a></div></div>
                    </div> 
                    
                </div>`
                }
                else{
                    format += ` <div class="box ArticleBoxCount">
                    <div class="container">
                       <div class="container Content" style="font-size:110%;">${data[i]["content"]}</div>
                       <br>
                       <div class="row"><div class="col-10">
                       
                       <sub class="ArticleDate">${data[i]["date"]}</sub>
                       <br>
                       <span>By:<i class="ArticlePublisher"> ${data[i]["publisher"]}</i></span>
                       <br>
                       </div><div class="col"></div></div>
                    </div> 
                    
                </div>`;
                }
                a++;
            }

            document.getElementById("commentary").innerHTML = format;

        }
    };
    xhttp.open("POST", "/displayComment", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `roomID=${roomID}`;
    xhttp.send(att);

}
function publish(){
    try{
        var username = localStorage.getItem("username");
        if(username == "" || username == null){
            throw "Empty username tag";
        }
        var roomID = localStorage.getItem("privateSessionID")
        var content  = document.getElementById("content").value;
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
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML = this.responseText;
               
                location.reload();
            }
        };
        xhttp.open("POST", "/publishComment", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        att = `content=${content}&publisher=${username}&date=${f}&roomID=${roomID}`;
        xhttp.send(att);

            
    }
    catch(err){
        console.log({err});
    }
  
}
const p = `<div class="box" id="newpost">
<div class="container">
    
    <div class="row">
        <div class="col-9">
            <h3>New Comment</h3>
        </div>
    </div>
   
  
    <textarea style="width:80%; min-height: 300px;" placeholder="content" id="content"></textarea>
    
    <br>
    <br>
    <div class="row">
        <div class="col">
            <!--Cancel-->
            <a href="" class="btn btn-sm btn-danger">Cancel</a>
        </div>
        <div class="col">
            <!--Submit-->
            <a class="btn btn-sm btn-info" onclick="publish()">Comment</a>
        </div>
    </div>
</div> 

</div> `
function newPost(){
    document.getElementById("newPost").innerHTML = p;
}

async function del(n){
    document.getElementById(n).remove();
    var decompressedImgCur = Base64.decode(n);
   
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
            if(this.responseText == "safe"){
                location.reload();
            }
            else{
                console.log(this.responseText)
            }
            
        }
    };
    xhttp.open("DELETE", "/deleteComment", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    att = `content=${decompressedImgCur}&RoomID=${roomID}`
    xhttp.send(att);
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


