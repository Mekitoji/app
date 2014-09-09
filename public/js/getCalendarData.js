// $(document).ready($('.inner-table-appName tbody'));

var data_manual = {};


$.get('http://localhost:3000/api/calendar', function (data) {

  console.log('data:');
  console.log(data);
  var storageOfDate = [];
  var appNameObj = {};

  // var test = {};
  //Push data in array
  for (var i = 0; i < data.length; i++) {
    appNameObj[data[i].appId._id] = data[i].appId.appName;
    // storageOfDate.push(data[i].storage);
    var innerStorage = data[i].storage;

    for (j = 0; j < innerStorage.length; j++) {

      if (!data_manual[innerStorage[j].fullDate]) {
        data_manual[innerStorage[j].fullDate] = {};
      }

      data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
    }
  }

  console.log('\n\ndata_manual:');
  console.log(data_manual);

  console.log('appNameObj:');
  console.log(appNameObj);
  // console.log('storageOfDate:');
  // console.log(storageOfDate);

  //create tr for each elem in data array
  $.each(appNameObj, function (i, appName) {
    var tr = $('<tr>');
    $('<td>').html(appName).appendTo(tr);
    $('.inner-table-appName tbody').append(tr);
  });

  var count = 0;
  $('td.fc-day').each(function (i, elem) {
    var thisCol = $(this),
      table = $('<table>'),
      dd = thisCol.data('date'),

      thisColTable = table.addClass('column-table').attr('id', 'dataTableColumn' + (++count)).appendTo(thisCol);



    $.each(data_manual, function (date, valueArr) {

      $.each(appNameObj, function (appId, appName) {
        if (date == dd) {
          if (valueArr[appId]) {
            // console.log(date + ' ' + appName + " = " + valueArr[appId]);
            var tr = $('<tr>').css({
              'height': '21px ',
              'text-align': 'center'
            });
            $('<td>').html(valueArr[appId]).addClass('inner-table-value').appendTo(tr);
            thisColTable.append(tr);
          } else {
            var empty = $('<tr>').css({
              'height': '21px ',
              'text-align': 'center'
            });
            $('<td>').html('').addClass('inner-table-value').appendTo(empty);
            thisColTable.append(empty);
          }
        }
      });
    });

  });

});

setTimeout(function () {
  $('#dataTableColumn1').editableTableWidget();
}, 2000);





$('.fc-next-button, .fc-prev-button, .fc-today-button').click(function () {
  $('td.fc-day').ready(function () {
    $.get('http://localhost:3000/api/calendar', function (data) {

      console.log('data:');
      console.log(data);
      var storageOfDate = [];
      var appNameObj = {};

      // var test = {};
      //Push data in array
      for (var i = 0; i < data.length; i++) {
        appNameObj[data[i].appId._id] = data[i].appId.appName;
        // storageOfDate.push(data[i].storage);
        var innerStorage = data[i].storage;

        for (j = 0; j < innerStorage.length; j++) {

          if (!data_manual[innerStorage[j].fullDate]) {
            data_manual[innerStorage[j].fullDate] = {};
          }

          data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
        }
      }

      console.log('\n\ndata_manual:');
      console.log(data_manual);

      console.log('appNameObj:');
      console.log(appNameObj);
      // console.log('storageOfDate:');
      // console.log(storageOfDate);


      var count = 0;
      $('td.fc-day').each(function (i, elem) {
        var thisCol = $(this),
          table = $('<table>'),
          dd = thisCol.data('date'),

          thisColTable = table.addClass('column-table').attr('id', 'dataTableColumn' + (++count)).appendTo(thisCol);



        $.each(data_manual, function (date, valueArr) {

          $.each(appNameObj, function (appId, appName) {
            if (date == dd) {
              if (valueArr[appId]) {
                // console.log(date + ' ' + appName + " = " + valueArr[appId]);
                var tr = $('<tr>').css({
                  'height': '21px ',
                  'text-align': 'center'
                });
                $('<td>').html(valueArr[appId]).addClass('inner-table-value').appendTo(tr);
                thisColTable.append(tr);
              } else {
                var empty = $('<tr>').css({
                  'height': '21px ',
                  'text-align': 'center'
                });
                $('<td>').html('').addClass('inner-table-value').appendTo(empty);
                thisColTable.append(empty);
              }
            }
          });
        });
        if (thisColTable[0].childNodes[0] === undefined) {
          $.each(appNameObj, function () {
            var empty = $('<tr>').css({
              'height': '21px ',
              'text-align': 'center'
            });
            $('<td>').html('').addClass('inner-table-value').appendTo(empty);
            thisColTable.append(empty);
          });

        }
      });

    });
  });
});