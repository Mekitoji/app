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
    // dayClick: function (date, jsEvent, view) {

    //   alert('Clicked on: ' + date.format());

    //   // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

    //   // alert('Current view: ' + view.name);

    //   // change the day's background color just for fun
    //   $(this).css('background-color', 'red');

    // },
    defaultView: 'basicWeek',
    editable: true,
    firstDay: 1,
    weekends: false,
  });

});