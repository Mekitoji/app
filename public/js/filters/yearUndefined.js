angular.module('history-project')

.filter("undefinedData", function(){
  return function(i) {
    return i == null ? "2015" : i;
  }
});