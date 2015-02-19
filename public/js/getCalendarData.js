// $(document).ready($('.inner-table-appName tbody'));



var data_manual = {};
var url;

var region = document.URL.split('/')[3];
var subLoc = document.URL.split('/')[4].slice(0, -1);
console.log(subLoc);
if (region == 'cis') {
  if (subLoc === 'approved') {
    url = '../api/cis/calendar/approved';
  } else if (subLoc === 'rejected') {
    url = '../api/cis/calendar/rejected';
  } else if (subLoc === 'outdated') {
    url = '../api/cis/calendar/outdated';
  } else {
    url = '../api/cis/calendar/';
  }
} else if (region == 'eu') {
  if (subLoc === 'approved') {
    url = '../api/eu/calendar/approved';
  } else if (subLoc === 'rejected') {
    url = '../api/eu/calendar/rejected';
  } else if (subLoc === 'outdated') {
    url = '../api/eu/calendar/outdated';
  } else {
    url = '../api/eu/calendar/';
  }
} else if (region == 'global') {
  if (subLoc === 'approved') {
    url = '../api/global/calendar/approved';
  } else if (subLoc === 'rejected') {
    url = '../api/global/calendar/rejected';
  } else if (subLoc === 'outdated') {
    url = '../api/global/calendar/outdated';
  } else {
    url = '../api/global/calendar/';
  }
}




$.get(url, function (data) {

  console.log('data:');
  console.log(data);
  var storageOfDate = [];
  var appNameObj = {};
  var calendarId = {};
  var checkOutdated = {};
  // var test = {};
  //Push data in array
  for (var i = 0; i < data.length; i++) {

    calendarId[data[i]._id] = data[i].appId._id;
    appNameObj[data[i].appId._id] = data[i].appId.appName;
    // storageOfDate.push(data[i].storage);
    var innerStorage = data[i].storage;
    checkOutdated[data[i].appId._id] = data[i].appId.outdated;

    for (j = 0; j < innerStorage.length; j++) {

      if (!data_manual[innerStorage[j].fullDate]) {
        data_manual[innerStorage[j].fullDate] = {};
      }

      data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
    }
  }

  console.log('checkOutdated');
  console.log(checkOutdated);

  var keys = [];
  var appNameObjNew = {};
  Object.keys(appNameObj)
    .map(function (k) {
      return [k, appNameObj[k]];
    })
    .sort(function (a, b) {
      if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
      if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
      return 0;
    })
    .forEach(function (d) {
      appNameObjNew[d[0]] = d[1];
      keys.push(d[0]);
    });
  // console.log(appNameObjNew);


  // console.log('\n\ndata_manual:');
  // console.log(data_manual);

  // console.log('appNameObj:');
  // console.log(appNameObj);
  // console.log('calendarId'); //calendarId
  // console.log(calendarId); //calendarId
  // console.log('storageOfDate:');
  // console.log(storageOfDate);

  $('.appNameRow').each(function () {
    $(this).remove();
  });

  //create tr for each elem in data array
  $.each(appNameObjNew, function (i, appName) {
    if (checkOutdated[i] === false) {
      var tr = $('<tr>').addClass('appNameRow').css({
        'height': '23px'
      });
      $('<td>').html(appName).appendTo(tr);
      $('.inner-table-appName tbody').append(tr);
    }
  });

  var count = 0;
  $('td.fc-day').each(function (i, elem) {
    var thisCol = $(this),
      table = $('<table>'),
      dd = thisCol.data('date'),

      thisColTable = table.addClass('column-table').attr('id', 'dataTableColumn' + (++count)).appendTo(thisCol);

    $.each(data_manual, function (date, valueArr) {

      $.each(appNameObjNew, function (appId, appName) {
        if (checkOutdated[appId] === false) {
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
              if (td.html() == 'L') {
                td.css({
                  "background-color": "orange",
                  "color": "black"
                });
              } else if (td.html() == 'H') {
                td.css({
                  "background-color": "#B19CD9",
                  "color": "black"
                });
              } else if (td.html() == 'D') {
                td.css({
                  "background-color": "green",
                  "color": "black"
                });
              } else if (td.html() == 'LL') {
                td.css({
                  "background-color": "orange",
                  "color": "orange"
                });
              }
              td.on('change', function (evt, newValue) {

                var thisElem = $(this);
                // console.log('thisElem');
                // console.log(thisElem);
                // console.log('evt');
                // console.log(evt);
                // console.log('newValue');
                // console.log(newValue);
                var classArr = thisElem.attr('class').split(' ');
                // console.log(classArr);

                if (newValue == 'L') {
                  thisElem.css({
                    "background-color": "orange",
                    "color": "black"
                  });
                } else if (newValue == 'H') {
                  thisElem.css({
                    "background-color": "#B19CD9",
                    "color": "black"
                  });
                } else if (newValue == 'D') {
                  thisElem.css({
                    "background-color": "green",
                    "color": "black"
                  });
                } else if (newValue == 'LL') {
                  thisElem.css({
                    "background-color": "orange",
                    "color": "orange"
                  });
                }

                $.ajax({
                  type: 'PUT',
                  url: '../api/' + region + '/calendar/' + classArr[1],
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
                // console.log('thisElem');
                // console.log(thisElem);
                // console.log('evt');
                // console.log(evt);
                // console.log('newValue');
                // console.log(newValue);
                var classArr = thisElem.attr('class').split(' ');
                // console.log(classArr);
                if (newValue == 'L') {
                  thisElem.css({
                    "background-color": "orange",
                    "color": "black"
                  });
                } else if (newValue == 'H') {
                  thisElem.css({
                    "background-color": "#B19CD9",
                    "color": "black"
                  });
                } else if (newValue == 'D') {
                  thisElem.css({
                    "background-color": "green",
                    "color": "black"
                  });
                } else if (newValue == 'LL') {
                  thisElem.css({
                    "background-color": "orange",
                    "color": "orange"
                  });
                }
                $.ajax({
                  type: 'PUT',
                  url: '../api/' + region + '/calendar/' + classArr[1],
                  data: {
                    value: newValue,
                    fullDate: classArr[0],
                  }
                });
              });
            }
          }
        }
      });

    });
    if (thisColTable[0].childNodes[0] === undefined) {
      $.each(appNameObjNew, function (appId, appName) {
        if (checkOutdated[appId] === false) {
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
            // console.log('thisElem');
            // console.log(thisElem);
            // console.log('evt');
            // console.log(evt);
            // console.log('newValue');
            // console.log(newValue);
            var classArr = thisElem.attr('class').split(' ');
            // console.log(classArr);
            if (newValue == 'L') {
              thisElem.css({
                "background-color": "orange",
                "color": "black"
              });
            } else if (newValue == 'H') {
              thisElem.css({
                "background-color": "#B19CD9",
                "color": "black"
              });
            } else if (newValue == 'D') {
              thisElem.css({
                "background-color": "green",
                "color": "black"
              });
            } else if (newValue == 'LL') {
              thisElem.css({
                "background-color": "orange",
                "color": "orange"
              });
            }
            $.ajax({
              type: 'PUT',
              url: '../api/' + region + '/calendar/' + classArr[1],
              data: {
                value: newValue,
                fullDate: classArr[0],
              }
            });
          });
        }
      });
    }
    $('.fc-day-grid').off();
    if (permission) {
      table.editableTableWidget({
        editor: $('<select><option value=\'H\' style="background-color:#B19CD9">H</option><option value=\'D\' style="background-color:green">D</option><option value=\'L\' style="background-color:orange">L</option><option value=\'LL\' style="background-color:orange"></option></select>')
      });
    }
  });
  $('.fc-content-skeleton').remove();
});


//fc-toolbar click event listener
$('.fc-next-button, .fc-prev-button, .fc-today-button').click(function () {
  $('td.fc-day').ready(function () {
    $.get(url, function (data) {

      // console.log('data:');
      // console.log(data);
      var storageOfDate = [];
      var appNameObj = {};
      var calendarId = {};
      var checkOutdated = {};
      // var test = {};
      //Push data in array
      for (var i = 0; i < data.length; i++) {
        calendarId[data[i]._id] = data[i].appId._id;
        appNameObj[data[i].appId._id] = data[i].appId.appName;
        // storageOfDate.push(data[i].storage);
        var innerStorage = data[i].storage;
        checkOutdated[data[i].appId._id] = data[i].appId.outdated;

        for (j = 0; j < innerStorage.length; j++) {

          if (!data_manual[innerStorage[j].fullDate]) {
            data_manual[innerStorage[j].fullDate] = {};
          }

          data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
        }
      }
      console.log(checkOutdated);
      var keys = [];
      var appNameObjNew = {};
      Object.keys(appNameObj)
        .map(function (k) {
          return [k, appNameObj[k]];
        })
        .sort(function (a, b) {
          if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
          if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
          return 0;
        })
        .forEach(function (d) {
          appNameObjNew[d[0]] = d[1];
          keys.push(d[0]);
          console.log('here');
          console.log(d[1]);
        });
      console.log(appNameObjNew);


      // console.log('\n\ndata_manual:');
      // console.log(data_manual);

      // console.log('appNameObj:');
      // console.log(appNameObj);
      // console.log('calendarId'); //calendarId
      // console.log(calendarId); //calendarId
      // console.log('storageOfDate:');
      // console.log(storageOfDate);

      $('.appNameRow').each(function () {
        $(this).remove();
      });

      //create tr for each elem in data array
      $.each(appNameObjNew, function (i, appName) {
        if (checkOutdated[i] === false) {
          var tr = $('<tr>').addClass('appNameRow').css({
            'height': '23px'
          });
          $('<td>').html(appName).appendTo(tr);
          $('.inner-table-appName tbody').append(tr);
        }
      });

      var count = 0;
      $('td.fc-day').each(function (i, elem) {
        var thisCol = $(this),
          table = $('<table>'),
          dd = thisCol.data('date'),

          thisColTable = table.addClass('column-table').attr('id', 'dataTableColumn' + (++count)).appendTo(thisCol);

        $.each(data_manual, function (date, valueArr) {

          $.each(appNameObjNew, function (appId, appName) {
            if (checkOutdated[appId] === false) {
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
                  if (td.html() == 'L') {
                    td.css({
                      "background-color": "orange",
                      "color": "black"
                    });
                  } else if (td.html() == 'H') {
                    td.css({
                      "background-color": "#B19CD9",
                      "color": "black"
                    });
                  } else if (td.html() == 'D') {
                    td.css({
                      "background-color": "green",
                      "color": "black"
                    });
                  } else if (td.html() == 'LL') {
                    td.css({
                      "background-color": "orange",
                      "color": "orange"
                    });
                  }
                  td.on('change', function (evt, newValue) {

                    var thisElem = $(this);
                    // console.log('thisElem');
                    // console.log(thisElem);
                    // console.log('evt');
                    // console.log(evt);
                    // console.log('newValue');
                    // console.log(newValue);
                    var classArr = thisElem.attr('class').split(' ');
                    // console.log(classArr);

                    if (newValue == 'L') {
                      thisElem.css({
                        "background-color": "orange",
                        "color": "black"
                      });
                    } else if (newValue == 'H') {
                      thisElem.css({
                        "background-color": "#B19CD9",
                        "color": "black"
                      });
                    } else if (newValue == 'D') {
                      thisElem.css({
                        "background-color": "green",
                        "color": "black"
                      });
                    } else if (newValue == 'LL') {
                      thisElem.css({
                        "background-color": "orange",
                        "color": "orange"
                      });
                    }

                    $.ajax({
                      type: 'PUT',
                      url: '../api/' + region + '/calendar/' + classArr[1],
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
                    // console.log('thisElem');
                    // console.log(thisElem);
                    // console.log('evt');
                    // console.log(evt);
                    // console.log('newValue');
                    // console.log(newValue);
                    var classArr = thisElem.attr('class').split(' ');
                    // console.log(classArr);
                    if (newValue == 'L') {
                      thisElem.css({
                        "background-color": "orange",
                        "color": "black"
                      });
                    } else if (newValue == 'H') {
                      thisElem.css({
                        "background-color": "#B19CD9",
                        "color": "black"
                      });
                    } else if (newValue == 'D') {
                      thisElem.css({
                        "background-color": "green",
                        "color": "black"
                      });
                    } else if (newValue == 'LL') {
                      thisElem.css({
                        "background-color": "orange",
                        "color": "orange"
                      });
                    }
                    $.ajax({
                      type: 'PUT',
                      url: '../api/' + region + '/calendar/' + classArr[1],
                      data: {
                        value: newValue,
                        fullDate: classArr[0],
                      }
                    });
                  });
                }
              }
            }
          });

        });
        if (thisColTable[0].childNodes[0] === undefined) {
          $.each(appNameObjNew, function (appId, appName) {
            if (checkOutdated[appId] === false) {
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
                // console.log('thisElem');
                // console.log(thisElem);
                // console.log('evt');
                // console.log(evt);
                // console.log('newValue');
                // console.log(newValue);
                var classArr = thisElem.attr('class').split(' ');
                // console.log(classArr);
                if (newValue == 'L') {
                  thisElem.css({
                    "background-color": "orange",
                    "color": "black"
                  });
                } else if (newValue == 'H') {
                  thisElem.css({
                    "background-color": "#B19CD9",
                    "color": "black"
                  });
                } else if (newValue == 'D') {
                  thisElem.css({
                    "background-color": "green",
                    "color": "black"
                  });
                } else if (newValue == 'LL') {
                  thisElem.css({
                    "background-color": "orange",
                    "color": "orange"
                  });
                }
                $.ajax({
                  type: 'PUT',
                  url: '../api/' + region + '/calendar/' + classArr[1],
                  data: {
                    value: newValue,
                    fullDate: classArr[0],
                  }
                });
              });
            }
          });
        }
        $('.fc-day-grid').off();
        if (permission) {
          table.editableTableWidget({
            editor: $('<select><option value=\'H\' style="background-color:#B19CD9">H</option><option value=\'D\' style="background-color:green">D</option><option value=\'L\' style="background-color:orange">L</option><option value=\'LL\' style="background-color:orange"></option></select>')
          });
        }
      });
      $('.fc-content-skeleton').remove();
    });
  });
});