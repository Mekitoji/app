// $(document).ready($('.inner-table-appName tbody'));



$.get('http://localhost:3000/api/calendar', function (data) {

  console.log('data:');
  console.log(data);
  var storageOfDate = [];
  var appNameArray = [];

  var test = {};

  //Push data in array
  for (var i = 0; i < data.length; i++) {
    appNameArray.push(data[i].appId.appName);
    storageOfDate.push(data[i].storage);

    var temp_storage = data[i].storage;

    for (j = 0; j < temp_storage.length; j++) {

      if (!test[temp_storage[j].fullDate])
        test[temp_storage[j].fullDate] = {};

      test[temp_storage[j].fullDate][data[i].appId._id] = temp_storage[j].value;
    }
  }

  console.log('\n\ntest:');
  console.log(test);

  var data_manual = {};



  console.log('appName:');
  console.log(appNameArray);
  console.log('storageOfDate:');
  console.log(storageOfDate);

  //create tr for each elem in data array
  $.each(appNameArray, function (i, data) {
    var tr = $('<tr>');
    $('<td>').html(data).appendTo(tr);
    $('.inner-table-appName tbody').append(tr);
  });

  $('td.fc-day').each(function (i, data) {
    var thisRow = $(this),
      table = $('<table>'),
      dd = thisRow.data('date'),
      thisColTable = table.appendTo(thisRow);
    // console.log(dd);
    data_manual[dd] = [];
    $.each(storageOfDate, function (i, data1) {
      // console.log(data1);
      $.each(data1, function (j, data2) {
        // console.log(data2);
        if (data2.fullDate == dd) {
          data_manual[dd].push(data2.value);
          return false;
        }
      });

      if (data_manual[dd] < i + 1) {
        data_manual[dd].push('');

      }
    });
    console.log(data_manual);
  });









  /*  for (var j = 0, length = data.length; j < length; j++) {
    // console.log(data[j].fullDate);
    // console.log(dd);
    if (data[j].fullDate === dd) {
      // console.log(dd);
      var tr = $('<tr>');
      tr.html(data[j].value);
      thisColTable.append(tr);
    } else if (data[length - 1].fullDate !== dd) {
      var newtr = $('<tr>');
      newtr.html('');
      thisColTable.append(newtr);
    }*/
});