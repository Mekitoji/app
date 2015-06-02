// $(document).ready($('.inner-table-appName tbody'));
var data_manual = {};
var url;

var region = document.location.pathname.split('/')[1];
var subLoc = document.location.pathname.split('/')[4];
var historyDate = document.URL.split('/')[5];

if (region == 'cis') {
  if (subLoc === 'approved') {
    url = '../../../api/cis/history/' + historyDate;
  } else if (subLoc === 'rejected') {
    url = '../../../api/cis/history/' + historyDate + '/rejected';
  } else if (subLoc === 'outdated') {
    url = '../../../api/cis/history/' + historyDate + '/outdated';
  } else {
    url = '../../../api/cis/history/' + historyDate;
  }
} else if (region == 'eu') {
  if (subLoc === 'approved') {
    url = '../../../api/eu/history/' + historyDate;
  } else if (subLoc === 'rejected') {
    url = '../../../api/eu/history/' + historyDate + '/rejected';
  } else if (subLoc === 'outdated') {
    url = '../../../api/eu/history/' + historyDate + '/outdated';
  } else {
    url = '../../../api/eu/history/' + historyDate;
  }
} else if (region == 'global') {
  if (subLoc === 'approved') {
    url = '../../../api/global/history/' + historyDate;
  } else if (subLoc === 'rejected') {
    url = '../../../api/global/history/' + historyDate + '/rejected';
  } else if (subLoc === 'outdated') {
    url = '../../../api/global/history/' + historyDate + '/outdated';
  } else {
    url = '../../../api/global/history/' + historyDate;
  }
} else if (region == 'sia') {
  if (subLoc === 'approved') {
    url = '../../../api/sia/history/' + historyDate;
  } else if (subLoc === 'rejected') {
    url = '../../../api/sia/history/' + historyDate + '/rejected';
  } else if (subLoc === 'outdated') {
    url = '../../../api/sia/history/' + historyDate + '/outdated';
  } else {
    url = '../../../api/sia/history/' + historyDate;
  }
}




$.ajax({
  method: 'GET',
  url: url
}).done(function (data) {

  if (data.calendar === undefined) {
    var container = document.getElementsByClassName("container")[0];
    var notice = document.createElement("div");
    notice.id = "notice-error";
    notice.innerHTML = "No data for this date. Please try another.";
    while (container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }
    container.appendChild(notice);
  } else {

    var lo = document.location.pathname.split('/')[4];
    if (lo === "approved") {
      data = data.approvedCalendar;
    } else {
      data = data.calendar;
    }
    var storageOfDate = [];
    var appNameObj = {};
    var calendarId = {};
    var appIdMap = {};
    // var test = {};
    //Push data in array
    for (var i = 0; i < data.length; i++) {
      if (data[i] !== null && data[i].appId !== null) {
        calendarId[data[i]._id] = data[i].appId._id;
        appNameObj[data[i].appId._id] = data[i].appId.appName;
        appIdMap[data[i].appId._id] = data[i].appId.applicationId;
        // storageOfDate.push(data[i].storage);
        var innerStorage = data[i].storage;

        for (j = 0; j < innerStorage.length; j++) {

          if (!data_manual[innerStorage[j].fullDate]) {
            data_manual[innerStorage[j].fullDate] = {};
          }

          data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
        }
      }
    }


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

    $('.appNameRow').each(function () {
      $(this).remove();
    });

    //create tr for each elem in data array
    $.each(appNameObjNew, function (i, appName) {
      appIdMap[i] = appIdMap[i].split("/")[0];
      var tr = $('<tr>').addClass('appNameRow').css({
        'height': '23px'
      });
      var td = $('<td>').html(appName).appendTo(tr);
      td.attr('data-toggle', 'popover');
      td.attr('data-placement', 'top');
      td.attr('data-content', 'Application Id: ' + appIdMap[i]);
      td.popover({
        trigger: 'hover'
      });
      $('.inner-table-appName tbody').append(tr);
    });

    var count = 0;
    $('td.fc-day').each(function (i, elem) {
      var thisCol = $(this),
        table = $('<table>'),
        dd = thisCol.data('date'),

        thisColTable = table.addClass('column-table').attr('id', 'dataTableColumn' + (++count)).appendTo(thisCol);

      $.each(data_manual, function (date, valueArr) {

        $.each(appNameObjNew, function (appId, appName) {

          if (date == dd) {
            if (valueArr[appId]) {
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
                var classArr = thisElem.attr('class').split(' ');
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
                var classArr = thisElem.attr('class').split(' ');
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

        });

      });
      if (thisColTable[0].childNodes[0] === undefined) {
        $.each(appNameObjNew, function (appId, appName) {
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
            var classArr = thisElem.attr('class').split(' ');
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

        });
      }
      $('.fc-day-grid').off();
    });
    $('.fc-content-skeleton').remove();
    $('.loading-icon').hide();
  }
});


//fc-toolbar click event listener
$('.fc-next-button, .fc-prev-button, .fc-today-button').click(function () {
  $('.loading-icon').show();
  $('td.fc-day').ready(function () {
    $.ajax({
      method: 'GET',
      url: url
    })

    .done(function (data) {
      var lo = document.location.pathname.split('/')[4];
      if (lo === "approved") {
        data = data.approvedCalendar;
      } else {
        data = data.calendar;
      }
      var storageOfDate = [];
      var appNameObj = {};
      var calendarId = {};
      var appIdMap = {};
      // var test = {};
      //Push data in array
      for (var i = 0; i < data.length; i++) {
        if (data[i] !== null) {
          calendarId[data[i]._id] = data[i].appId._id;
          appNameObj[data[i].appId._id] = data[i].appId.appName;
          appIdMap[data[i].appId._id] = data[i].appId.applicationId;
          // storageOfDate.push(data[i].storage);
          var innerStorage = data[i].storage;

          for (j = 0; j < innerStorage.length; j++) {

            if (!data_manual[innerStorage[j].fullDate]) {
              data_manual[innerStorage[j].fullDate] = {};
            }

            data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
          }
        }
      }
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

      $('.appNameRow').each(function () {
        $(this).remove();
      });

      //create tr for each elem in data array
      $.each(appNameObjNew, function (i, appName) {

        var tr = $('<tr>').addClass('appNameRow').css({
          'height': '23px'
        });
        var td = $('<td>').html(appName).appendTo(tr);
        td.attr('data-toggle', 'popover');
        td.attr('data-placement', 'top');
        td.attr('data-content', 'Application Id: ' + appIdMap[i]);
        td.popover({
          trigger: 'hover'
        });
        $('.inner-table-appName tbody').append(tr);

      });

      var count = 0;
      $('td.fc-day').empty();
      $('td.fc-day').each(function (i, elem) {
        var thisCol = $(this),
          table = $('<table>'),
          dd = thisCol.data('date'),

          thisColTable = table.addClass('column-table').attr('id', 'dataTableColumn' + (++count)).appendTo(thisCol);

        $.each(data_manual, function (date, valueArr) {

          $.each(appNameObjNew, function (appId, appName) {

            if (date == dd) {
              if (valueArr[appId]) {
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
                  var classArr = thisElem.attr('class').split(' ');

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
                  var classArr = thisElem.attr('class').split(' ');
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

          });

        });
        if (thisColTable[0].childNodes[0] === undefined) {
          $.each(appNameObjNew, function (appId, appName) {
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
              var classArr = thisElem.attr('class').split(' ');
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

          });
        }
        $('.fc-day-grid').off();
      });
      $('.fc-content-skeleton').remove();
      $('.loading-icon').hide();
    });
  });
});