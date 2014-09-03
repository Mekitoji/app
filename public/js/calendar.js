//option object with startDay ptoperties
var Calendar = function (options) {
  options = options || {};
  var self = this;

  var currentDate = new Date();

};

Calendar.prototype.nextWeek = function (currentWeek) {
  currentWeek.getDay();
};


Calendar.prototype.previousWeek = function (currentWeek) {
  // body...
};


Calendar.prototype.previousYear = function (currentYear) {
  // body...
};

Calendar.prototype.nextYear = function (currentYear) {
  // body...
};
Calendar.prototype.today = function () {
  return new Date();
};