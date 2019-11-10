document.addEventListener('DOMContentLoaded', function() {
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
        var title = prompt('Event Title:');
        if (title) {
          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          })
        }
        calendar.unselect()
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [
        // {
        //   title: 'All Day Event',
        //   start: '2019-08-01'
        // },
        
        // {
        //   groupId: 999,
        //   title: 'Repeating Event',
        //   start: '2019-08-09T16:00:00'
        // },
       
      ]
    });

    calendar.render();
  });

var s = new Date();
var m = Number(s.getMonth()) + 1;
var f = "2019" + "-" + m + "-" + s.getDate();
console.log({s,f});
console.log(typeof(f));    
localStorage.setItem("date", f);