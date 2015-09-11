'use strict';
var Calendar = require('../models/CIS/calendar');
// var Apps = require('../models/CIS/gk');
var _ = require('lodash');

Calendar.find({})
.exec(function(err, apps) {
  if(err) return new Error("errorr!");
  var count = 0;
  for(var i = 0; i< apps.length; i++) {
    for(var j = 0; j<apps[i].storage.length; j++) {
      if(apps[i].storage[j].value === "L" && apps[i].storage[j].value === "LL"){
        var d = new Date(apps[i].storage[j].fullDate);
        d.setDate(d.getDate() - 1);
        d = formatDate(d);
        for(var k = 0; k <apps[i].storage.length; k++) {
        //   if(apps[i].storage[k].fullDate === d && (apps[i].storage[k].value === "D" || apps[i].storage[k].value === "L" || apps[i].storage[k].value === undefined)) {
        //     ++count;
        //   }
        //   // if(apps[i].storage[k].fullDate === d && apps[i].storage[k].value !== "H") {
        //   //   ++count;
        //   // }
        if(apps[i].storage[k].fullDate === d && apps[i].storage[k].value !== "H" || apps[i].storage[k].value !== undefined){
          ++count;
        }
        }
      }
    }
  }
  console.log(count);
});

function formatDate(dx) {
  var dd = dx.getDate();
  var dm = dx.getMonth() + 1;
  var dy = dx.getFullYear();

  if (dd.toString().length === 1) {
    dd = '0' + dd;
  }

  if (dm.toString().length === 1) {
    dm = '0' + dm;
  }

  var d = dy + "-" + dm + "-" + dd;
  return d;
}

// function createMap(app, c) {
//   var storageMap = [];
//   _.each(c, function (ca) {
//     if (ca.appId._id === app._id) {
//       _.each(ca.storage, function (cd) {
//         storageMap[cd.fullDate] = cd.value;
//       });
//     }
//   });
//   return storageMap;
// }
//

function checkAppDate(cdate, map) {
  var LIMIT = 14;
  var DAY_COUNT = 2;
  var prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 1);
  var fDate = formatDate(prevDate);
  switch (map[cdate]) {
  case "L":
  case "H":
  case "D":
    return false;
    break;
  default:

    var count = 0;
    for (var i = 0; i <= LIMIT; i++) {
      switch (map[fDate]) {
      case "H":
      case "D":
      case "L":
        return false;
        break;
      case "LL":
        count++;
        if (count >= DAY_COUNT) {
          return true;
        }
        break;
      default:
        // console.log(map[fDate], fDate);
        // console.log(map)
        break;
      }
      prevDate.setDate(prevDate.getDate() - 1);
      fDate = formatDate(prevDate);
    }
    return false;
    break
  }
}
