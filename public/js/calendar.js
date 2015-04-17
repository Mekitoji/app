$(document).ready(function () {

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    defaultView: 'basicWeek',
    editable: true,
    firstDay: 1,
    weekends: false,
  });
});