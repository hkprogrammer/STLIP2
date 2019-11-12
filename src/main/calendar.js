var listOfDate = [];


function startup(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("demo").innerHTML = this.responseText;
     
      let rawDates = JSON.parse(this.responseText);
      
      for(i=0;i<rawDates.length;i++){
        var temp = {
          "title": "Session",
          "start" : rawDates[i]
        }  
        listOfDate.push(temp)
      }
      console.log(listOfDate)
      var calendarEl = document.getElementById('calendar');

   

      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
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
          var y = String(d.getDate());
          if(y.length = 1){
            y = "0" + y;
          }
          var f = d.getFullYear() + "-" + m + "-" + y;
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
          localStorage.setItem("date",f);
          localStorage.setItem("day",s);
          window.open("detail.html", "_blank");
          console.log(calendar);
          calendar.unselect()
          
        },
        editable: true,
        eventLimit: true, 
        events: listOfDate
      });
      
      calendar.render();
      console.log(listOfDate)
      $(`*[data-date=\"${f}\"]`)[0].style.backgroundColor = "rgb(252, 248, 227,0.5)";
    }
  };
  xhttp.open("GET", "/loadSessionsDates", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //xhttp.send("fname=Henry&lname=Ford");
  xhttp.send();



  //calendar Initialization
  
}





var s = new Date();
var m = Number(s.getMonth()) + 1;
var f = s.getFullYear() + "-" + m + "-" + s.getDate();
// console.log({s,f});
// console.log(typeof(f));    
// localStorage.setItem("date", f);

