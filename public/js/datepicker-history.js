var locationC = document.URL.split('/')[3];
var subLoc = document.URL.split('/')[4].slice(0, -1);

$(document).ready(function () {
  $('#datepicker').datepicker({
    inline: true,
    onSelect: function (dateText, inst) {
      var d = new Date(dateText);
      $('#calendar').fullCalendar('gotoDate', d);
      $('td.fc-day').ready(function () {
        $.get(url, function (data) {
          $('.column-table').remove();
          $('.appNameRow').remove();
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
              // storageOfDate.push(data[i].storage);
              var innerStorage = data[i].storage;
              appIdMap[data[i].appId._id] = data[i].appId.applicationId;

              for (j = 0; j < innerStorage.length; j++) {

                if (!data_manual[innerStorage[j].fullDate]) {
                  data_manual[innerStorage[j].fullDate] = {};
                }

                data_manual[innerStorage[j].fullDate][data[i].appId._id] = innerStorage[j].value;
              }
            }
          }
          var keys = [];
          var sortedAppNameObj = {};
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
              sortedAppNameObj[d[0]] = d[1];
              keys.push(d[0]);
            });
          $('.appNameRow').each(function () {
            $(this).remove();
          });

          //create tr for each elem in data array
          $.each(sortedAppNameObj, function (i, appName) {
            var tr = $('<tr>').addClass('appNameRow');
            $('<td>').html(appName).appendTo(tr).attr('data-toggle', 'popover').attr('data-placement', 'top').attr('data-content', 'Application Id: ' + appIdMap[i]).popover({
              trigger: 'hover'
            }).css({
              'height': '23px'
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

              $.each(sortedAppNameObj, function (appId, appName) {
                if (date == dd) {
                  if (valueArr[appId]) {
                    var tr = $('<tr>').css({
                      'height': '23px ',
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
                        url: url + classArr[1],
                        data: {
                          value: newValue,
                          fullDate: classArr[0],
                        }
                      });
                    });
                  } else {
                    var empty = $('<tr>').css({
                      'height': '23px ',
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
                        url: url + classArr[1],
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
              $.each(sortedAppNameObj, function (appId, appName) {
                var empty = $('<tr>').css({
                  'height': '23px ',
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
                    url: url + classArr[1],
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
        });
      });
    }
  });
});