$(document).ready($('.fc-view').find('.fc-day').append());

$.get('http://localhost:3000/api/calendar', function (data) {
  console.log(data);
  $('.fc-view').find('.fc-day').html(data[0]._id);
});