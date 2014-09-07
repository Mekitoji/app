// $(document).ready($('.inner-table-appName tbody'));



$.get('http://localhost:3000/api/calendar', function(data) {
  console.log(data);
  var appNameArray = [];
  //Push data in array
  for (var i = 0; i < data.length; i++) {
    appNameArray.push(data[i].appId.appName);
  }

  var storageOfDate=[];
  for (i = 0; i < data.length; i++) {
    storageOfDate.push(data[i].storage);
  }

  console.log(appNameArray);
  console.log(storageOfDate);
  
  //create tr for each elem in data array
  $.each(appNameArray, function(i, data) {
    var tr = $('<tr>');
    $('<td>').html(data).appendTo(tr);
    $('.inner-table-appName tbody').append(tr);
  });

  $('td.fc-day').each(function(i, data){
    var thisRow = $(this);
    var table = $('<table>');
    var tr=$('<tr>');


    // var div = $('<div>');
    // $('<div>').text('<p>penis</p>').appendTo(div);
    // thisRow.append(div);
  });
});