// $(document).ready($('.inner-table-appName tbody'));

var data_manual = {};


$.get('http://localhost:3000/api/calendar', function (data) {

  console.log('data:');
  console.log(data);
  var storageOfDate = [];
  var appNameObj = {};
  var calendarId = {}; //calendarId

  // var test = {};
  //Push data in array
  for (var i = 0; i < data.length; i++) {

    calendarId[data[i]._id] = data[i].appId._id; //calendarId
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
  console.log('calendarId'); //calendarId
  console.log(calendarId); //calendarId
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
            var td = $('<td>');
            $.each(calendarId, function (calId, appId11) {
              if (appId === appId11)
                td.html(valueArr[appId]).addClass(date).addClass(calId).appendTo(tr);
            });

            thisColTable.append(tr);
            td.on('change', function (evt, newValue) {
              var thisElem = $(this);
              console.log('thisElem');
              console.log(thisElem);
              console.log('evt');
              console.log(evt);
              console.log('newValue');
              console.log(newValue);
              var classArr = thisElem.attr('class').split(' ');
              console.log(classArr);

              $.ajax({
                type: 'PUT',
                url: 'http://localhost:3000/api/calendar/' + classArr[1],
                data: {
                  value: newValue,
                  fullDate: classArr[0],
                }
              });
            });
          } else {
            var empty = $('<tr>').css({
              'height': '21px ',
              'text-align': 'center'
            });
            var td1 = $('<td>');
            $.each(calendarId, function (calId, appId11) {
              if (appId === appId11)
                td1.html('').addClass(dd).addClass(calId).appendTo(empty);
            });
            thisColTable.append(empty);
            td1.on('change', function (evt, newValue) {
              var thisElem = $(this);
              console.log('thisElem');
              console.log(thisElem);
              console.log('evt');
              console.log(evt);
              console.log('newValue');
              console.log(newValue);
              var classArr = thisElem.attr('class').split(' ');
              console.log(classArr);

              $.ajax({
                type: 'PUT',
                url: 'http://localhost:3000/api/calendar/' + classArr[1],
                data: {
                  value: newValue,
                  fullDate: classArr[0],
                }
              });
            });
          }
        }
      });
    });
    if (thisColTable[0].childNodes[0] === undefined) {
      $.each(appNameObj, function (appId, appName) {
        var empty = $('<tr>').css({
          'height': '21px ',
          'text-align': 'center'
        });
        var td = $('<td>');
        $.each(calendarId, function (calId, appId11) {
          if (appId === appId11)
            td.html('').addClass(dd).addClass(calId).appendTo(empty);
        });
        thisColTable.append(empty);
        td.on('change', function (evt, newValue) {
          var thisElem = $(this);
          console.log('thisElem');
          console.log(thisElem);
          console.log('evt');
          console.log(evt);
          console.log('newValue');
          console.log(newValue);
          var classArr = thisElem.attr('class').split(' ');
          console.log(classArr);

          $.ajax({
            type: 'PUT',
            url: 'http://localhost:3000/api/calendar/' + classArr[1],
            data: {
              value: newValue,
              fullDate: classArr[0],
            }
          });
        });
      });
    }
    $('.fc-day-grid').off();
    table.editableTableWidget();

  });
  $('.fc-content-skeleton').remove();

});


//fc-toolbar click event listener
$('.fc-next-button, .fc-prev-button, .fc-today-button').click(function () {
  $('td.fc-day').ready(function () {
    $.get('http://localhost:3000/api/calendar', function (data) {

      console.log('data:');
      console.log(data);
      var storageOfDate = [];
      var appNameObj = {};
      var calendarId = {};

      // var test = {};
      //Push data in array
      for (var i = 0; i < data.length; i++) {
        calendarId[data[i]._id] = data[i].appId._id;
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
      console.log('calendarId'); //calendarId
      console.log(calendarId); //calendarId
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
                var td = $('<td>');
                $.each(calendarId, function (calId, appId11) {
                  if (appId === appId11)
                    td.html(valueArr[appId]).addClass(date).addClass(calId).appendTo(tr);
                });
                thisColTable.append(tr);
                td.on('change', function (evt, newValue) {
                  var thisElem = $(this);
                  console.log('thisElem');
                  console.log(thisElem);
                  console.log('evt');
                  console.log(evt);
                  console.log('newValue');
                  console.log(newValue);
                  var classArr = thisElem.attr('class').split(' ');
                  console.log(classArr);

                  $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:3000/api/calendar/' + classArr[1],
                    data: {
                      value: newValue,
                      fullDate: classArr[0],
                    }
                  });
                });
              } else {
                var empty = $('<tr>').css({
                  'height': '21px ',
                  'text-align': 'center'
                });
                var td1 = $('<td>');
                $.each(calendarId, function (calId, appId11) {
                  if (appId === appId11)
                    td1.html('').addClass(date).addClass(calId).appendTo(empty);
                });
                thisColTable.append(empty);
                td1.on('change', function (evt, newValue) {
                  var thisElem = $(this);
                  console.log('thisElem');
                  console.log(thisElem);
                  console.log('evt');
                  console.log(evt);
                  console.log('newValue');
                  console.log(newValue);
                  var classArr = thisElem.attr('class').split(' ');
                  console.log(classArr);

                  $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:3000/api/calendar/' + classArr[1],
                    data: {
                      value: newValue,
                      fullDate: classArr[0],
                    }
                  });
                });
              }
            }
          });

        });
        if (thisColTable[0].childNodes[0] === undefined) {
          $.each(appNameObj, function (appId, appName) {
            var empty = $('<tr>').css({
              'height': '21px ',
              'text-align': 'center'
            });
            var td = $('<td>');
            $.each(calendarId, function (calId, appId11) {
              if (appId === appId11)
                td.html('').addClass(dd).addClass(calId).appendTo(empty);
            });
            thisColTable.append(empty);
            td.on('change', function (evt, newValue) {
              var thisElem = $(this);
              console.log('thisElem');
              console.log(thisElem);
              console.log('evt');
              console.log(evt);
              console.log('newValue');
              console.log(newValue);
              var classArr = thisElem.attr('class').split(' ');
              console.log(classArr);

              $.ajax({
                type: 'PUT',
                url: 'http://localhost:3000/api/calendar/' + classArr[1],
                data: {
                  value: newValue,
                  fullDate: classArr[0],
                }
              });
            });
          });
        }
        $('.fc-day-grid').off();
        table.editableTableWidget();


      });
      $('.fc-content-skeleton').remove();
    });
  });
});